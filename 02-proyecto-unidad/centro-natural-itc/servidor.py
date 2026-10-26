"""Servidor local de la práctica y reconocimiento de una muestra WAV fija.

No recibe rutas ni ejecuta órdenes proporcionadas por el navegador.
"""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json
import os
import subprocess

RAIZ = Path(__file__).resolve().parent


class Aplicacion(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(RAIZ), **kwargs)

    def do_POST(self):
        if self.path != '/api/reconocer-muestra':
            self.send_error(404)
            return
        # Solo solicitudes del propio origen local; no hay acceso desde Internet.
        if self.headers.get('Origin') not in (None, 'http://127.0.0.1:8070', 'http://localhost:8070'):
            self.send_error(403)
            return
        try:
            if os.name != 'nt':
                raise RuntimeError('La muestra local requiere Windows con reconocimiento es-ES instalado.')
            proceso = subprocess.run(['powershell.exe', '-NoProfile', '-NonInteractive', '-File',
                str(RAIZ / 'reconocer-muestra.ps1')], capture_output=True, timeout=15)
            if proceso.returncode:
                raise RuntimeError('No se ha podido reconocer la muestra con el motor local instalado.')
            texto = proceso.stdout.decode('utf-8-sig', errors='replace')
            resultado = json.loads(texto)
            estado = 200
        except (OSError, RuntimeError, ValueError, subprocess.TimeoutExpired) as error:
            resultado, estado = {'error':str(error)}, 503
        cuerpo = json.dumps(resultado, ensure_ascii=False).encode('utf-8')
        self.send_response(estado)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(cuerpo)))
        self.end_headers()
        self.wfile.write(cuerpo)


if __name__ == '__main__':
    print('RA2: http://127.0.0.1:8070 (solo equipo local)', flush=True)
    ThreadingHTTPServer(('127.0.0.1', 8070), Aplicacion).serve_forever()
