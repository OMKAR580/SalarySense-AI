import os
import re

app_dir = r"E:\Employee Salary Classification\apps\api\app"

def get_module_path(module_parts):
    # module_parts is a list like ['backend', 'app', 'auth', 'recovery_exceptions']
    # We ignore 'backend' and 'app' because they are prefixes.
    # The actual parts could be in 'app' or 'app.Auth'.
    
    if module_parts[0] == 'backend':
        module_parts = module_parts[1:]
    if module_parts[0] == 'app':
        module_parts = module_parts[1:]
        
    # Now we have something like ['auth', 'recovery_exceptions']
    # Let's see if this maps to a file or directory under app
    
    def check_path(base_parts, parts):
        current = os.path.join(app_dir, *base_parts)
        for i in range(len(parts)):
            part = parts[i]
            # It could be a directory or a file
            next_dir = os.path.join(current, part)
            if os.path.isdir(next_dir):
                current = next_dir
            elif os.path.isfile(next_dir + ".py"):
                # Matches a file, so the rest must be attributes inside the file
                return True, ".".join(['app'] + base_parts + parts[:i+1])
            elif os.path.isfile(os.path.join(current, "__init__.py")) and i == len(parts) - 1:
                return True, ".".join(['app'] + base_parts + parts[:i+1])
            else:
                # Part not found, maybe it's an attribute in __init__.py of current
                if os.path.isfile(os.path.join(current, "__init__.py")):
                     return True, ".".join(['app'] + base_parts + parts[:i])
                return False, None
        # If we exhausted all parts and it's a directory
        return True, ".".join(['app'] + base_parts + parts)

    # First check if it's in Auth
    found, mapped = check_path(['Auth'], module_parts)
    if found:
        return mapped
        
    # Next check if it's in root app
    found, mapped = check_path([], module_parts)
    if found:
        return mapped
        
    # If not found, return None
    return None

import_pattern = re.compile(r'^(.*?\b(?:from|import)\s+)backend\.app\.([a-zA-Z0-9_\.]+)(.*)$')
import_pattern2 = re.compile(r'^(.*?\b(?:from|import)\s+)backend\.([a-zA-Z0-9_\.]+)(.*)$')

modified_files = []

for root, _, files in os.walk(app_dir):
    for f in files:
        if f.endswith('.py'):
            filepath = os.path.join(root, f)
            try:
                with open(filepath, 'r', encoding='utf-8') as file:
                    content = file.read()
            except:
                continue
                
            new_content = []
            changed = False
            lines = content.split('\n')
            for i, line in enumerate(lines):
                # Simple replace for explicit backend.app
                m = import_pattern.match(line)
                if not m:
                    m = import_pattern2.match(line)
                    if m:
                        parts = ['backend'] + m.group(2).split('.')
                    else:
                        new_content.append(line)
                        continue
                else:
                    parts = ['backend', 'app'] + m.group(2).split('.')
                
                # Check for import backend.app.X as Y or rom backend.app.X import Y
                # If we have rom backend.app.X import Y, parts are X
                
                mapped = get_module_path(parts)
                if mapped:
                    new_line = m.group(1) + mapped + m.group(3)
                    new_content.append(new_line)
                    changed = True
                    print(f"Fixed in {f}: {line.strip()} -> {new_line.strip()}")
                else:
                    # Maybe it's importing a variable directly. Let's try popping parts
                    found = False
                    for j in range(1, len(parts)):
                        mapped = get_module_path(parts[:-j])
                        if mapped:
                            # It's like rom backend.app.core import config
                            # Wait, if we are doing import backend.app.core.config, then get_module_path should find config.py
                            pass
                            
                    # Fallback string replace if we can't find it dynamically.
                    # Usually ackend.app.X -> pp.Auth.X if X is in Auth, else pp.X.
                    print(f"Could not resolve: {line.strip()} in {f}")
                    new_content.append(line)
                    
            if changed:
                with open(filepath, 'w', encoding='utf-8') as file:
                    file.write('\n'.join(new_content))
                modified_files.append(filepath)

print(f"Modified {len(modified_files)} files.")
