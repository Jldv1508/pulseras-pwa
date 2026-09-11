from PIL import Image
import os

ruta_origen = "desktop/icono.png"
ruta_destino = "pwa/public/iconos"

if not os.path.exists(ruta_origen):
    print(f"ERROR: No existe {ruta_origen}")
    exit(1)

os.makedirs(ruta_destino, exist_ok=True)

img = Image.open(ruta_origen).convert("RGBA")
print(f"OK Icono original: {img.size[0]}x{img.size[1]}")

for tamano in [192, 512]:
    img_res = img.resize((tamano, tamano), Image.LANCZOS)
    ruta = os.path.join(ruta_destino, f"icono-{tamano}.png")
    img_res.save(ruta, "PNG")
    print(f"OK {ruta}")

print("OK Iconos PWA listos")
