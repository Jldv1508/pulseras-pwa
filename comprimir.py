from PIL import Image
import os

carpeta = "infografias"
ancho_max = 1400
calidad = 82

total_antes = 0
total_despues = 0

for archivo in sorted(os.listdir(carpeta)):
    if not archivo.lower().endswith((".jpg", ".jpeg", ".png")):
        continue
    ruta = os.path.join(carpeta, archivo)
    peso_antes = os.path.getsize(ruta)
    total_antes += peso_antes

    img = Image.open(ruta)

    if img.width > ancho_max:
        ratio = ancho_max / img.width
        nuevo_alto = int(img.height * ratio)
        img = img.resize((ancho_max, nuevo_alto), Image.LANCZOS)

    img = img.convert("RGB")
    img.save(ruta, "JPEG", quality=calidad, optimize=True, progressive=True)

    peso_despues = os.path.getsize(ruta)
    total_despues += peso_despues

    reduccion = (1 - peso_despues/peso_antes) * 100
    print(f"{archivo}: {peso_antes//1024} KB -> {peso_despues//1024} KB (-{reduccion:.0f}%)")

print(f"\nTotal: {total_antes//1024} KB -> {total_despues//1024} KB")
print(f"Reduccion total: {(1 - total_despues/total_antes)*100:.0f}%")
