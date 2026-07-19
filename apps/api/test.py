import urllib.request
class NoRedirection(urllib.request.HTTPRedirectHandler):
    def http_error_302(self, req, fp, code, msg, headers): return fp
    http_error_301 = http_error_303 = http_error_307 = http_error_302

opener = urllib.request.build_opener(NoRedirection)
response = opener.open('http://127.0.0.1:8000/api/v1/auth/oauth/google/login')
print('Status:', response.getcode())
print('Location:', response.headers.get('Location'))
