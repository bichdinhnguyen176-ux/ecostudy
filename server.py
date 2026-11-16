"""
ECOSTUDY LOCAL HTTP SERVER (PYTHON 3)
Run this script to preview the EcoStudy web application:
    python server.py
"""

import http.server
import socketserver
import os
import sys

PORT = 3000

class EcoStudyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Disable browser caching during active development
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def guess_type(self, path):
        # Ensure correct MIME type for ES modules
        if path.endswith('.js'):
            return 'application/javascript; charset=utf-8'
        elif path.endswith('.css'):
            return 'text/css; charset=utf-8'
        elif path.endswith('.html'):
            return 'text/html; charset=utf-8'
        return super().guess_type(path)

if __name__ == '__main__':
    web_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(web_dir)
    
    handler = EcoStudyHTTPRequestHandler
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print("=" * 60)
        print("🌱 EcoStudy Platform 2.0 is running!")
        print(f"🔗 Local URL: http://localhost:{PORT}")
        print("✨ Concept: Learn Smart. Rest Well. Grow Better.")
        print("=" * 60)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")
            sys.exit(0)

