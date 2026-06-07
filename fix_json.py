import json

with open('backend/data/testdriller_questions.json', 'r') as f:
    lines = f.readlines()

# It seems there's an extra ] before the last ]
new_lines = []
for line in lines:
    if line.strip() == ']':
        # check if next line is also ]
        continue
    new_lines.append(line)

# Let's just try to load and fix it properly if it fails
content = "".join(lines)
try:
    json.loads(content)
    print("JSON is valid")
except Exception as e:
    print(f"JSON invalid: {e}")
    # Manual fix based on sed output
    content = content.replace('    ]\n\n    ]', '    ]')
    try:
        json.loads(content)
        with open('backend/data/testdriller_questions.json', 'w') as f:
            f.write(content)
        print("JSON fixed")
    except Exception as e2:
        print(f"JSON still invalid: {e2}")
