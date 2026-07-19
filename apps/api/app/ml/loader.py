import os
import json
import logging
import joblib
import sklearn.compose._column_transformer

logger = logging.getLogger(__name__)

# Apply ColumnTransformer monkey-patch for older scikit-learn pickles
if not hasattr(sklearn.compose._column_transformer, "_RemainderColsList"):
    class _RemainderColsList(list):
        pass
    sklearn.compose._column_transformer._RemainderColsList = _RemainderColsList

class MLLoader:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(MLLoader, cls).__new__(cls, *args, **kwargs)
            cls._instance._initialized = False
        return cls._instance

    def initialize(self, model_dir: str):
        if self._initialized:
            return
        
        self.model_path = os.path.join(model_dir, "trained_model.pkl")
        self.preprocessor_path = os.path.join(model_dir, "preprocessor.pkl")
        self.features_path = os.path.join(model_dir, "feature_columns.json")
        self.metadata_path = os.path.join(model_dir, "model_metadata.json")

        # Validate existence of files
        for path in [self.model_path, self.preprocessor_path, self.features_path, self.metadata_path]:
            if not os.path.exists(path):
                raise FileNotFoundError(f"Model framework file missing: {path}")

        logger.info("Initializing ML assets...")
        try:
            self.model = joblib.load(self.model_path)
            self.preprocessor = joblib.load(self.preprocessor_path)
            
            with open(self.features_path, "r") as f:
                self.feature_columns = json.load(f)
                
            with open(self.metadata_path, "r") as f:
                self.metadata = json.load(f)
                
            # Patch SimpleImputer instance attributes for scikit-learn 1.8+ compatibility
            self._patch_simple_imputer(self.preprocessor)
            self._patch_simple_imputer(self.model)
            
            self._initialized = True
            logger.info("ML loader successfully loaded and patched model assets.")
        except Exception as e:
            logger.error(f"Failed to load ML assets: {str(e)}")
            raise e

    def _patch_simple_imputer(self, obj):
        from sklearn.impute import SimpleImputer
        from sklearn.pipeline import Pipeline
        from sklearn.compose import ColumnTransformer
        import numpy as np

        if isinstance(obj, SimpleImputer):
            # Patch SimpleImputer if strategy is one of the standard statistical imputations
            if obj.strategy in ['mean', 'median', 'most_frequent'] and not hasattr(obj, '_fill_dtype'):
                if hasattr(obj, 'statistics_') and len(obj.statistics_) > 0:
                    val = obj.statistics_[0]
                    if isinstance(val, (int, float, np.integer, np.floating)):
                        obj._fill_dtype = np.float64
                    else:
                        obj._fill_dtype = object
                else:
                    obj._fill_dtype = np.float64
        elif isinstance(obj, Pipeline):
            for name, step in obj.steps:
                self._patch_simple_imputer(step)
        elif isinstance(obj, ColumnTransformer):
            for name, transformer, columns in obj.transformers:
                self._patch_simple_imputer(transformer)
            if hasattr(obj, 'transformers_'):
                for name, transformer, columns in obj.transformers_:
                    self._patch_simple_imputer(transformer)
