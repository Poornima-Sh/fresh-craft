from PIL import Image

def remove_background(input_path, output_path, threshold=100):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    newData = []
    # Using a simple luminosity threshold or color distance
    for item in datas:
        # item is (R, G, B, A)
        # Calculate perceived brightness
        brightness = (item[0] * 299 + item[1] * 587 + item[2] * 114) / 1000
        
        # If the pixel is dark (part of the background), make it transparent
        if brightness < threshold:
            # We can also do partial transparency for anti-aliasing, but simple alpha 0 is a start.
            # Even better, let's just scale alpha based on brightness
            # If brightness is low, alpha is 0. If it's high (gold), alpha is 255.
            if brightness < 60:
                newData.append((item[0], item[1], item[2], 0))
            else:
                # Soft blend
                alpha = int(min(255, max(0, (brightness - 60) * (255 / (threshold - 60)))))
                newData.append((item[0], item[1], item[2], alpha))
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(output_path, "PNG")

remove_background("assets/images/refined-logo.png", "assets/images/refined-logo-transparent.png", threshold=120)
print("Background removed.")
