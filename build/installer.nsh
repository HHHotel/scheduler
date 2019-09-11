!macro customInstall
    ${ifNot} ${isUpdated}
        SetOutPath $APPDATA\Hounds

        File ${BUILD_RESOURCES_DIR}\config\settings.json
    ${endIf}
!macroend
