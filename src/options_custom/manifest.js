this.manifest = {
    "name": "rpjeeves",
    "icon": "icon48.png",
    "settings": [
        {
            "tab": i18n.get("information"),
            "group": i18n.get("welcome"),
            "name": "username",
            "type": "text",
            "label": i18n.get("username"),
            "text": "Ignore me for now"
        },
        {
            "tab": i18n.get("information"),
            "group": i18n.get("welcome"),
            "name": "password",
            "type": "text",
            "label": i18n.get("password"),
            "text": "Ignore me for now",
            "masked": true
        },
        {
            "tab": i18n.get("information"),
            "group": i18n.get("welcome"),
            "name": "myDescription",
            "type": "description",
            "text": i18n.get("description")
        }
    ],
    "alignment": [
        [
            "password",
            "username"
        ]
    ]
};
