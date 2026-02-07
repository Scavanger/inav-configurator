const s=`<html>\r
<head>\r
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\r
    <title>INAV Configurator - Receiver MSP Control Sticks</title>\r
    <script type="module" src="receiver_msp.js"><\/script>\r
    <link type="text/css" rel="stylesheet" href="../src/css/receiver-msp.css" media="all" />\r
\r
</head>\r
<body>\r
    <div class="control-gimbals">\r
        <div class="control-gimbal left">\r
            <span class="gimbal-label gimbal-label-vert"></span> <span class="gimbal-label gimbal-label-horz"></span> <span\r
                class="crosshair crosshair-vert"></span> <span class="crosshair crosshair-horz"></span>\r
            <div class="control-stick"></div>\r
        </div>\r
        <div class="control-gimbal right">\r
            <span class="gimbal-label gimbal-label-vert"></span> <span class="gimbal-label gimbal-label-horz"></span> <span\r
                class="crosshair crosshair-vert"></span> <span class="crosshair crosshair-horz"></span>\r
            <div class="control-stick"></div>\r
        </div>\r
    </div>\r
\r
    <div class="control-sliders">\r
        <div class="control-slider">\r
            <div class="slider">\r
                <span class="slider-label"></span>\r
            </div>\r
        </div>\r
        <div class="control-slider">\r
            <div class="slider">\r
                <span class="slider-label"></span>\r
            </div>\r
        </div>\r
        <div class="control-slider">\r
            <div class="slider">\r
                <span class="slider-label"></span>\r
            </div>\r
        </div>\r
        <div class="control-slider">\r
            <div class="slider">\r
                <span class="slider-label"></span>\r
            </div>\r
        </div>\r
        <div class="control-slider">\r
            <div class="slider">\r
                <span class="slider-label"></span>\r
            </div>\r
        </div>\r
        <div class="control-slider">\r
            <div class="slider">\r
                <span class="slider-label"></span>\r
            </div>\r
        </div>\r
        <div class="control-slider">\r
            <div class="slider">\r
                <span class="slider-label"></span>\r
            </div>\r
        </div>\r
        <div class="control-slider">\r
            <div class="slider">\r
                <span class="slider-label"></span>\r
            </div>\r
        </div>\r
    </div>\r
    <div class="warning">\r
        <p>\r
            These sticks allow INAV to be armed and tested without a transmitter or receiver being present.\r
            However, <strong>this feature is not intended for flight and propellers must not be attached.</strong>\r
        </p>\r
        <p>\r
            This feature does not guarantee reliable control of your craft. <strong>Serious injury is likely to\r
                result if propellers are left on.</strong>\r
        </p>\r
        <div class="button-enable btn">\r
            <a class="button-enable" href="#">Enable controls</a>\r
        </div>\r
    </div>\r
</body>\r
</html>\r
`;export{s as default};
