#!/bin/sh

if [ $# -lt 2 ]; then
 echo "Usage: $0 form.ui lang1 [lang2 ...]"
 exit 1
fi

ui=$1
shift

tsfiles () {
        for i in $@
        do
                echo ${ui/.ui/}_$i.ts
        done
}

uic-qt5 $ui > ui_${ui/.ui/.h}

cat > ${ui/.ui/.pro} <<EOF
SOURCES += ui_${ui/.ui/.h}
TRANSLATIONS += $(tsfiles $@)
EOF

lupdate-qt5 ${ui/.ui/.pro}

rm ui_${ui/.ui/.h}
rm ${ui/.ui/.pro}
