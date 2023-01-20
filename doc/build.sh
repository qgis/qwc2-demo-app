#!/bin/sh

echo "* Setting up venv..."
rm -rf .venv
python3 -mvenv .venv
source .venv/bin/activate
pip install -r requirements.txt

echo "* Clean previous build..."
rm -rf html
mkdir html

echo "* Building..."
LANGS="en"
for lang in $LANGS; do
    echo "Building $lang"
    mkdocs build -f QWC2_documentation_$lang.yml
    cp -a site/* html/
    rm -rf site
done

# cleanup venv
echo "* Clean venv..."
deactivate
rm -rf .venv
