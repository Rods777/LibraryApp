// Register all file plugins to install and use
// image preview, image resize, & file encode
FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode
);

FilePond.setOptions({
    stylePanelAspectRatio: 150 / 100,
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight: 150
}
);

// Turn all file input elements into ponds
FilePond.parse(document.body);