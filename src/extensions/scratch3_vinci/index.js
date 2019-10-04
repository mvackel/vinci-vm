/* eslint-disable no-negated-condition */
/* eslint-disable block-spacing */
/* eslint-disable brace-style */
/* eslint-disable no-alert */
/* eslint-disable spaced-comment */
/* eslint-disable no-console */
/* eslint-disable indent */
/* eslint-disable space-in-parens */
/* eslint-disable space-before-function-paren */
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Clone = require('../../util/clone');
const Cast = require('../../util/cast');
const formatMessage = require('format-message');
const MathUtil = require('../../util/math-util');
const Timer = require('../../util/timer');


/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 
'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmVyc2lvbj0iMS4xIgogICB3aWR0aD0iMTgwIgogICBoZWlnaHQ9IjE4MCIKICAgaWQ9InN2ZzgiCiAgIHNvZGlwb2RpOmRvY25hbWU9InZpbmNpNC1zbWFsbC5zdmciCiAgIGlua3NjYXBlOnZlcnNpb249IjAuOTIuNCAoNWRhNjg5YzMxMywgMjAxOS0wMS0xNCkiPgogIDxtZXRhZGF0YQogICAgIGlkPSJtZXRhZGF0YTE0Ij4KICAgIDxyZGY6UkRGPgogICAgICA8Y2M6V29yawogICAgICAgICByZGY6YWJvdXQ9IiI+CiAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CiAgICAgICAgPGRjOnR5cGUKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPgogICAgICAgIDxkYzp0aXRsZSAvPgogICAgICA8L2NjOldvcms+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KICA8ZGVmcwogICAgIGlkPSJkZWZzMTIiPgogICAgPGlua3NjYXBlOnBlcnNwZWN0aXZlCiAgICAgICBzb2RpcG9kaTp0eXBlPSJpbmtzY2FwZTpwZXJzcDNkIgogICAgICAgaW5rc2NhcGU6dnBfeD0iLTIzLjUwMjM0NiA6IDk2LjIwMjE2NSA6IDEiCiAgICAgICBpbmtzY2FwZTp2cF95PSIwIDogMTAwMCA6IDAiCiAgICAgICBpbmtzY2FwZTp2cF96PSIxOTYuMjM3NzcgOiA5Ni4yMDIxNjUgOiAxIgogICAgICAgaW5rc2NhcGU6cGVyc3AzZC1vcmlnaW49Ijg2LjM2NzcxIDogNjYuMjAyMTY1IDogMSIKICAgICAgIGlkPSJwZXJzcGVjdGl2ZTQ1NTciIC8+CiAgPC9kZWZzPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMSIKICAgICBvYmplY3R0b2xlcmFuY2U9IjEwIgogICAgIGdyaWR0b2xlcmFuY2U9IjEwIgogICAgIGd1aWRldG9sZXJhbmNlPSIxMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIKICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMTIxIgogICAgIGlkPSJuYW1lZHZpZXcxMCIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6em9vbT0iMy43MDgzODIyIgogICAgIGlua3NjYXBlOmN4PSIxMDQuNTQxNTQiCiAgICAgaW5rc2NhcGU6Y3k9Ijg1LjgyMDA4OCIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iLTkiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9Ii05IgogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0ic3ZnOCIgLz4KICA8Y2lyY2xlCiAgICAgc3R5bGU9Im9wYWNpdHk6MTtmaWxsOiNmZmZmMDA7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlOiM1NTAwMDA7c3Ryb2tlLXdpZHRoOjU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjE7cGFpbnQtb3JkZXI6bWFya2VycyBmaWxsIHN0cm9rZSIKICAgICBpZD0icGF0aDgxNyIKICAgICBjeD0iMTI4LjQ5ODQ5IgogICAgIGN5PSI0NC44MTMyNTUiCiAgICAgcj0iMzQuNjI2OTM4IiAvPgogIDx0ZXh0CiAgICAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIKICAgICBzdHlsZT0iZm9udC1zdHlsZTpub3JtYWw7Zm9udC12YXJpYW50Om5vcm1hbDtmb250LXdlaWdodDpub3JtYWw7Zm9udC1zdHJldGNoOm5vcm1hbDtmb250LXNpemU6NjIuNTc5NjY5OTVweDtsaW5lLWhlaWdodDoxMjUlO2ZvbnQtZmFtaWx5OidBcmlhbCBSb3VuZGVkIE1UIEJvbGQnOy1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246J0FyaWFsIFJvdW5kZWQgTVQgQm9sZCwgJztmb250LXZhcmlhbnQtbGlnYXR1cmVzOm5vcm1hbDtmb250LXZhcmlhbnQtY2Fwczpub3JtYWw7Zm9udC12YXJpYW50LW51bWVyaWM6bm9ybWFsO2ZvbnQtZmVhdHVyZS1zZXR0aW5nczpub3JtYWw7dGV4dC1hbGlnbjpzdGFydDtsZXR0ZXItc3BhY2luZzowcHg7d29yZC1zcGFjaW5nOjBweDt3cml0aW5nLW1vZGU6bHItdGI7dGV4dC1hbmNob3I6c3RhcnQ7ZmlsbDojMDAwMDAwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoyLjM0NjczNzYycHg7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICB4PSIxNC4xNDQyODkiCiAgICAgeT0iMTU1LjgwMzM2IgogICAgIGlkPSJ0ZXh0NDYxNyIKICAgICB0cmFuc2Zvcm09InNjYWxlKDAuODkxMDM5MjcsMS4xMjIyODUpIj48dHNwYW4KICAgICAgIHNvZGlwb2RpOnJvbGU9ImxpbmUiCiAgICAgICBpZD0idHNwYW40NjE1IgogICAgICAgeD0iMTQuMTQ0Mjg5IgogICAgICAgeT0iMTU1LjgwMzM2IgogICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6bm9ybWFsO2ZvbnQtc3RyZXRjaDpub3JtYWw7Zm9udC1mYW1pbHk6QnJvYWR3YXk7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjpCcm9hZHdheTtzdHJva2Utd2lkdGg6Mi4zNDY3Mzc2MnB4Ij5WaW5jaTwvdHNwYW4+PC90ZXh0PgogIDxyZWN0CiAgICAgc3R5bGU9Im9wYWNpdHk6MTtmaWxsOiNhYTQ0MDA7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlOiM4MDAwMDA7c3Ryb2tlLXdpZHRoOjU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjE7cGFpbnQtb3JkZXI6bWFya2VycyBmaWxsIHN0cm9rZSIKICAgICBpZD0icmVjdDQ2MzMiCiAgICAgd2lkdGg9IjYzLjAxNTcwOSIKICAgICBoZWlnaHQ9Ijk2Ljk5Mjc5IgogICAgIHg9IjE5Ljg2MjI1NSIKICAgICB5PSIxMS4xMDA2OTgiIC8+CiAgPHJlY3QKICAgICBzdHlsZT0ib3BhY2l0eToxO2ZpbGw6I2ZmYTYwMDtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6ZXZlbm9kZDtzdHJva2U6IzgwMDAwMDtzdHJva2Utd2lkdGg6NTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MTtwYWludC1vcmRlcjptYXJrZXJzIGZpbGwgc3Ryb2tlIgogICAgIGlkPSJyZWN0NDYzNSIKICAgICB3aWR0aD0iODEuODE0MTcxIgogICAgIGhlaWdodD0iNTYuNzM1ODU1IgogICAgIHg9IjQ2LjA1ODA2IgogICAgIHk9IjI4LjkzNzA1OSIgLz4KICA8cmVjdAogICAgIHN0eWxlPSJvcGFjaXR5OjE7ZmlsbDojZmZlNmQ1O2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpldmVub2RkO3N0cm9rZTojODAwMDAwO3N0cm9rZS13aWR0aDo1O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxO3BhaW50LW9yZGVyOm1hcmtlcnMgZmlsbCBzdHJva2UiCiAgICAgaWQ9InJlY3Q0NjM3IgogICAgIHdpZHRoPSI2Mi4yODI5NTUiCiAgICAgaGVpZ2h0PSI0OS4wNjk2NDkiCiAgICAgeD0iOTkuOTEyOTc5IgogICAgIHk9IjY5Ljg0ODMyOCIgLz4KPC9zdmc+Cg==';




/**
 * Icon svg to be displayed in the category menu, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const menuIconURI = blockIconURI;


/**
 *  Funcoes Genericas
 */

     /** 
     * String to ArrayBuffer
     *
     * @returns um ArrayBuffer representando a string
     */
    function s2buf(string) {
        return Buffer.from(string);
    }

    /** 
     * String to ArrayBuffer + CR + LF
     *
     * @returns um ArrayBuffer representando a string com CR e LF no final
     */
    function s2bufnl(string) {
        return Buffer.from(string+'\r\n');
    }


    /** 
     * DataView to String
     *
     * @returns uma String com representacao de caracteres CR e LF
     */
    function buf2snl(arrbView) {
        sRet = '';
        for (i=0; i < arrbView.byteLength; i++) {
            n = arrbView.getUint8(i);
            if (n >= 32) {
                sRet += String.fromCharCode(n);
            } else if (n == 13) {
                sRet += '\\r';
            } else if (n == 10) {
                sRet += '\\n';
            } else {
                sRet += String.fromCharCode(1);
            }
        }
        //return String.fromCharCode.apply( null, new Uint16Array(arrbView) )
        //new new TextDecoder().decode(arrbView);
        return sRet
    }

    /** 
     * DataView to String
     *
     * @returns uma String SEM representacao de caracteres CR e LF
     */
    function buf2s(arrbView) {
        return new TextDecoder().decode(arrbView);
    }
	
    /** 
     * Convert graus para radianos
	 *
     * @param   valor em graus
     * @returns o valor do argumento em radianos (real)
     */
	function calcRads(angle) {
		return angle * Math.PI / 180.0;
	}
		
	
	function soundBeep1() {
		var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
		snd.play();
	}
	
function soundBeep2() {
	var snd = new Audio(	
"data:audio/wav;base64,UklGRng9AABXQVZFZm10IB4AAABVAAIARKwAACBOAAABAAAADAABAAIAAAAKAgEAcQVmYWN0BAAAAAAAAABkYXRhOT0AAP/7oAAAAAAAAEuFAAAIAAAJcKAAARzWGTv5moALPrGnvylQAAogwwkwhAUwIwoDA6FQmAf/dyNrI/4EZQHABCH/BLBwYodCGKOTIGYRuBgMBcnyJqAwkBAFBEBhQJfWcJwNAAxcLgLDgDDoX+VHNComBqIiAAj8DKIpAwcKQMjjX909NQIgMBjELgRBAGFAAFrYGARX/JwiCZoaGZuBnEkgbaKgGHy2BlsUhEagY7BIGFgl/zffoQCj+BiIhAY8CQGEBkBjYTASCgCAcBYKgYRAv/2+3gNAgfxxkgKTDbwbmCdERyx3/////oGxomQQxIOVSLm5mfQSLn/////////QWmtNRfSBGg8H2AGFmFoEoDICIFQqFg6NAB4eUAoPyUKQGNB45oeuEjgG0KY0yGgYpDYBwG5PjvRAw0DAGieBgwNembnCoBhgBAGB4AYgAYPBvzRRoaLA1IbgMQB0DKYzAYVAGJx3/ZdNQGLwWBg8TgDEMGzAGFwOBh0o/0GUgaYGlSeBrhFASSIGPROAMkAMNjEDFoN/6C0zembtCINBgNAwgCAJF8DExQAywKABi2FgAwR/927vvE2B6hUE7mxBBnA1YMgWCCf/////UgbqBM/////9zBAZ+kD4cCBQETVlAywkwiCGEyPJmMFTW14Ef7JfBKSVa6lP1PSSdadJJJ0CaCWHgm5sk//7ogAXgANdStZ3PaAIYSvLD+e0AIv861nnrWthgB0rfPahaiKKSU0WieRQWieYumqJ7atEujlE1GwvHlpOdMTVFSCS1ooomr0r23dIyNgvQLIkkkW////1JGz//sfiIDQigAEJEKSSSDqjFteFhThmNTEmrf4s1MSRqp6KJsnb9jZJFCtaSSSJuedJJJJSkkkkkvauiyLLfomo8R/BVEqUTFWbKSs6T3RWlq9T6ByP5ii7////+ij/////RZHYxjJLpcRFiIjSbTQmRxCXYtkMkrCIOrc66hsfWAUPOb9Nf9d3DoZPLGx8FQewclz7a93VTNHJhWqa6O/i3OhSDUEWTej7Fbp1HodVOmWS3Z1V8uciYjpLMFP/7wVV/9zyYqDUIYABCJEkkk5KvJxPECnNGOuk1j9UyPgqjahpGCSa1U0s1O/TbUSMCU3pJun3qepaU4uP5v+ChCB0VJEVrsoe3FyvzWo5ouGa4iFGnCEcSIgZQHtWpy2cUPf/y1AKw7i4gzABIREikkkJTTFzXZBhvqFZORDKMuEzMxJQVvd3wq+GtdMvQb8xtJbWJFYBI7LNGXczJ6qZFxL+UJZX8u95cPBeSrfcZ3l0Tx9Xft/772y0fVqb/+gSlxX/79YhCQt7oAEpEZtyNq8R1BygQ9AwUIP10t63ZwXYXGcf/LZb+2PeErZ6RpabzHv/+6AARIAC+TrV+eta1FxJSs89520MBOdP571rYagdazD3vW7rGWGzyfEfW6TKRMQ41Wqe7ulE3OUfCQGuRUuznOztvc21OtqtU011o9nuz+85P/cdbTzIACZERpJpIUGIJs4jRLAuD9QsnKMtbUsMekQ60RhrB1O2Zg23VvLuQdQw/prSoUW1TQNkZNY5rW70Ihk1DjrTs98W7YodOPHYT3LrdOj2O5qomq3R1/fcmhoE3f/yQd6YCSTdVTRke2CiOk4VYSYHXVPUtSeAI2zPIWcQVcos+PAkqknFstikasJ4/i+MzSRKwo9/mu8Wg6trFL7tm2rWrdi0+a0YLenH0WklKz2tibGo2desHP3r7+rZxP260lXHAo14cMk9/WJAwyABIzQ0203MGUv2CAogyzgRIMSWHTWmAwTNQNJZsnqnXp06rqBuooDFi2h+PRTRvZSSklmZ9SPoePJlJOMC9vS+7Y+N4v8Q8Sv19tb2/UHyZjyR71run3TWN1g2vr7/3AwzwqLWgAw1v/MeMkpNurpMjKw1xqMGQuMJihhqKi7TK6UwHyHBWPChRD3tR5FvmEdCpg1j1gw1fCjN9le4MU7vFo+sbs8du6w40DFM59cajUtmSVct5WqqHbFrZ3Gt6Rta1ut8Y/3/9b/rFj0R//YPOpxIBSTS0qQ+K9LTZmKswWyWDKljc/f/+6IAdIADWzrS+e962GgnSrxh71uOHO9NjGHrccMdaj2MPWy1MSgYGGSafVqZZrALBLHd3ueE1LKrS4r3WsbbpaV2kgD3SjY4rSuq2mhwVy2xqbfVxBhRp8+SuYmm7FT4anDdJZdz+TWtS+vzBgemdRPnGbbywTIuFjcb/9CjGOhCiGrNdttQBATVY4wiCHTQnEBWOUk3T3LrwNeImTmMqlWchZ2xOFYY2a8mUNc3dNlyPDiJ17AYlEsNyQV2lzfcZxxpS5nlzAviel7Qp7Q9xZsQDcBvq1qcmezlNJqmvjNI1oVdYzXO8e1f91bWV1OA1EATZFZ7t9qAIovO6uaAmZQGoEEhtAiFLD0YeB0wNyRUONW7leVNemqXLUNTDcYZ/HqsnYCxMN1iKjTGb0A5bmviJAgKRyYHu4b6C8zH3/essXcBTLsh4sDEY0+svYNaR/h/u19bjXxv6+f8YkkXKiom6UBRDRFlttgAo5QyhezDn8dAzjXTdrRL7cli4GTGH4jVHGY/F3Aq3KLKeikwyFm1/tuMtP04hafhMxpI1KoNwkb3toMLazGk3BgT5mw+cNwHOsHT2M1JkbpIHkr9qq3P/v2kpbVs3t9a/j61qtKt8WV1hX0JcctjkcYAmY+7LI2dPFZLB0Moo8lp7DegyDDSUi3vpcqgRsyFZbafnC+E1L4yvmT/Clzb//ugAI0AA446U/s4ethzZ1pPYw9bDsjrV6w963m4nKmw/D1va0F6l2ZSo5SMMdTxH7xXPIbfHiytj2uZ3962pmtGFujKJCVSzLirE4KK8uHkBrs1Txpod8RZpofzEmgQyrUKhhYaoBNNv/pAbUMbxFyRnrgKkVcFKxZdDrhqJERpdd5XxjrdXJw+7Lq8ccdlDb356Xwk8pMocqWuKk1MeSEOU7PHle5YH0VQQm+lJZYsto334s8z2Z6W8Hs8tLmWArHto8Oka2/jFPq2fn0r9+V0IkDVkqOSNyNoAZbrsMdBvp5HUWjLW17Xm38mzKp96dxI1dpW5TEiltbKdrNEeWLWbXIWGxtfWgoklgSK7cfrKhT9aZYD1qjM/rM/ePH14WaUp9tsOKhqEgxyxwIW30NyZIb/UlbU0+lpPqDuXftmmsLp8nlUzjmQoqs77b/0AWYekrEIBboisBFqpWXyt9sOkQYFcXuysg9ElUVBFQ2Z80vjBAgQG5SaYZlU5qe0BIiuYbFZEpGjOUBw8r2HGfSuEJrgPV0y4g3Z4rLNKch2lwW1M4RHinYNwYd8t2c6833vOK0zj61mVPwG+udOYiKmitdtbRRXtyVf7BWsyxMcfA89/8rEFNhEq1Lz2so4CWgMLfR4dJRHElntobWxwH0ZVrk3REh9ngaRwPV0vMURLOl02KWJM1Uj//uiAJsAA506VOsYet52R1pfYe9bTuzrR/WHgCG2HOlynvAH4tJeFWmqWthhfKYMo5m7GI0Fii/FL6p4njazeNq0XGKXvGkXClVewL//iPRAJtt/9IDs/04I+zC7SBByGx1hueUqAKzuWVTM/f4JgqnT9xa1qGagGcSjxQMGsLaHHdM1KM5w7CSHu/vhwka2aigZctqp9Gu8S9oUXxdR4FmBiP4v6phwPO8mfM+vTFMbxW/rXWPbH/xD1IZ0pUl1lcSKYTCZjIJyZJbbeAS+w5CigbD49iKILqchXK5JW4LIGhMQa/InGdCHZ6VSuPrnfWJSLmqmi35wnBqkBlBDM0z82xOtd5u6LA4Afhh7vpCpepowqrzWFnD4sMBTOqzTiTVGDFAobQ7vLdfprTuxXuWH+gIQSGACBgQwRQzAhwYGpavt1KgciI/vnOf/+JHAaBL1g4I+Tr27s/bfaRT1EyqK9bh//397w5z7j6Oosdl8+/7tv2poxB3d41alrdWMvEd/gn4Py3hUj//8QJEkoqJJJNNpwuFxVoJbZhBqpqrNEFYSie0AygZFBK7HYW7RrOoWaKndeEtZannGGrsrafBsBRbn1bqg5lhQYAaCOAxokqsW2hzGG7O2FGGDBAgDA1L33aa6LPWW3899zzpE2ASFLpkoczZ+Jo7r1YbAUDYXqTWs8yiMYoUhRP/7oACnAAZ/T1HWZ0AE4CyqbcxoAIvo/1f89YAhbZxrP56wBD5hCBpnBuii9r+W4CLdXu//7//84KEOHv4ZcqZMeGB1IZ5w3Gdvy+djKGm58///98/vxTltdjiXsMMO5u9D0utslpdZSqIwL//////////38/33/zzpKSxn+O+f/4/9XVNZ90EBEjRG5G08FKysIuZbciBEyQm1lMKXbvmesdyxInxut5x5+WtOpOhm91nGQlG9+9F7NtItaWEKXsOta3bXuhxyPdH9TSI7QHoojtHadi/r/23P///uSSn7flgaAQd90ISI0RI5ZG8DCGNsWNEFjfHMlvhiDLvrLzTeplhyo/e57Tp0UjOIvu+trW/92VtOVRqanR2gdE6zeKu0nLvNGX/8fXTWHSCH061/U/zww8lYVO8qCz/d/EoBQNYQABI0RuVtzA7m1tH6fg2jKJWXpujHeHSi+6V7q0Tsa/HtJT4YfT0mHNa+LueX0+/nNdQp94vjcsaJGiwXGPqi6HEtzXnv863amlXBxuv+96zb6v29GUhWxf6/z/iFooWdrUDLv/4U5hIhEkRXLZHQHZWPKWfzw6WEy2AvxbuNGr5XZNRQu13Wo+7duvUsx+G8rn7tRhzELeavP2hC5xVNjHEQbDpzfLUh5FE0edPmnLaZEG58ynbue7305I8OwdrISuuv9xgPvv/7ogBkgANAN9P5+HrYZibqj2MLWwxw4VeHvStxopvqPPS9bJdp61EU+koltv/qsMc56hzPRjgJp/oas1DvCsvOrXCAopcNkOi61PCg6bx4vYTbzaLmmY5YJUSGkQoFBJLzZ1i3Yl+jSJbDAURQnHb7txG68qtzxvan9JYTrW4N5k8qaUVwbRe+o3//XpiRESIi2223AKC+DOIUOADsTFKwrhQwBBF7YAQWDt7J55Eaw4TiWMcjSCZcawnrZCUU7fDpGVT7OqXb23d9eLSvE9dPNxM6xmSJiVTbvjdc5+vv/2o/fQ6v7azjf+PRhBQrDrpEXt3jQIQRMiM0RuRtgAV8WtXiftoJMLgl5PJLH0HZoKOl1GGPd39JST0gr5S6JQLjDlPj6NwZScO3aOIkE8TlR8+bsn0V3fxt1rkMxUh4VaLqp2r1XQsuBwdRVt9Jy9XtYgKgDSG2j1ez17zHq1WazyqEHL2oAQCaKtt11oCuHawDlP4QosIuZcNYKkEc8tBLo7CeZPG0zE4cLP3S+uVFvThgV8fn3EcWaM3LDXEmQ11Ed3pIcjnCm3PAcKGiXFOx4UWHCxjcC6GwIlosfX+N5z47dRPOcOFNWPr+vvSFrOcR8tNEqCTuUNYwiREiK121twDbrUkKmDVW5i5C9jAbkOKGIavfeguOQwfDLq7HOTtkc6tsZC04rI//+6AAioADfTnV+fhi3nUHSl8971sOsOFN9YeAIcGb6X6w8AQ0J+SRgVMRhTtNotYa4jE/hy3bYENZZoVpatqpP1KQ3BwgUx58xXnYkpekHWvq2qVgZofbN6bxqtKX38RXLgA2TS+LnPXakJCRoiy7WzgdZBHmTMra+HcclmNSwuQHFh+VvHqWlyi+q9FUbZD1eATh+zPWdzExO9pZY8CA/iwY2oK6pCxBY7rDNE+J9UYlQ/iQ4VPBjNtKw4z7Tq/+qa1jGu3SNbN59bznX/3bE4VbkXsGP0IYgGikSTEWy2XE42245GGrjPMW3xVRFxC1QdKXmWFaW58tadfV3FHFby4npmp0/EF0QsIXoy9jt2mlz8zt5dgkLWPEGkPthW/G1li/hat2nkRimXkv53Je99LG7/DWKjYmghyg8NOh4CDYQcVXcgiT5k9Dhveo5tv3edVp8LkDT6eJP1yM7mMN/3Xf/43GJeAAC/XngeWYWOFgIX5rY7wmf/+//f737dPUi9PKJiA6aVUuv3//9WK4nf4GJgmwCBz8eACSQI4kkk2nE2nFWwlxn/pS6UNToSmKSypFlVNj1IuPj5+1B6XDhp3m5yeNbch9pAHDJ+UxF87eFqcpJl65BfvY3852npFyRWrP01W9ep7Eo79PVMCBOkgRfbAYQgFgdKNMZEOBmaxXK/3PWr8uXFD/+6AAmAAF/U9VbmdABKmp2o3MaACNQN9X/PeAIY8bav+e8ATLryKGIHhmpPUeHMe93d7//7O7cXTXfS7S3+V+I6Y//67z//n//9+Mc/9fupY53vM8v/dzrv/rT+V6SMgE1RG5JIMGAYRfB+ZGStoeoG+GUI+FdChsutV3ZsDuNtWajW3d7SedyJChr2ut2xjPpSbdta3mDWlHzcG0EygX0fwtWYIaqhwp/q1p4uta1T/NMfe/S1rX1jvuwPaQ2n3f/7oaOpv6cgzMBNDSSNRgduJE3FrEJ6eygmzKepYkftlhY3umo64DRaHF3bNZrXu29Xqt/Hz6apijylPr7xbGPSKO0gapza1rRiiWaeudV9dva59/u1a43v738WzXXhRkUgQuN//////WG9YBMhJDNNtyOBumbhdZjNLYyM8yvmIuwqUZWM5/ta1Ulao4nWm7uq1/+bjymLLSlfjc1PdSrl5XF/TFn18OksEU1PoMCW1VIyxrM0bNLZmn1iH4/zfWfn3vHj2tvWYMdGrT2FBC5FZIWa7r/z4t4kQUklZRiCl08GpP4Ux7BdZoe4aK0S6Z7ClhPrp2MJeG/jWtaeuvKYIiTegkmiymrJVNvQUcU4Vwdgfx1NU2zUSQeCjVadE0ZF1LbouiqiY3tX1IE4H03UOF6vt88wx2ASUklpRhLFZGJpgv5NG5WLv/+6IAb4ADbzhU+fh62F9Gyqw97VuM7L9Th7HrccAbqn2HvWw0wkgA7L6JBTY7zK8Ug2DI3QVzrtuyqVansQIUP0pDfwrG6jYmNZ3fGurGEJaU6cW3HFp+3JOBaTWsyaxrxoH+v873IGQf4uPLJc+hrWepGhyXgt7evYNCAUQ0clkl4iywq8mGQe5YmhPeD5qsxskDkzxWyLC8aO8PoAkQhtRi3jbyurQijkd2eZjxIlruDYwYz8XrWa0i7Wi/FO7X4393j7bZb1zXEeu9w7NkT/1/363ia96Zvjc7ls2Vyos0Me+/QpXyAYDDIQESQ0bbkbwgjcbyMKslgSFFGK6RQD6kkNOvjJMrc7EpiGm6Cg35tRaE0tzGn5BUPo9iMLIkJh9i9pCwBZcht/7t8ehqWQTL/VPdjqxAx8b+ZkdVz9aL1cf5as5A3LtotrPTWi2kEhQSjeGvluhBVhzQP8lpoRAJoZpySN4JAWhvHMayNAaFEoTTYSkMg5D2ngWxy7ZlLdkjAUFejlY6td7f+rOOKVzPiS1vnOmLBzWjT5+calorD+nL07b9UxqRdVY6/2xJbWbaurZr/5+MY966/x/jDVoWQnhYA/T8l+DOZJBTSWmWIpPookjOggwB3GWqG4WceU5TbRKZrUVWxQXIqZSP1FZ7CO001nq3MMtHUs7a9qYiSG5WXk56f6tM//ugAJCAA6k303n4Ythshtp/Pw9bDiTdT4fhi3GsmKn8/D1srGjfB8EwfqiXxUxpq61e501jhb1hI/P0yazX1uHD1Pza1aoU6iohRYYJjvNOf826pyNciQxNTR2WWbhWEuM8frUTwxHBSXWzzGvQ1ajVnkv3LKtdhwlOo5NiesVKepS55tjZpHu/a8ObuTCdM1fN5dUisaQSx4D5j58TOrHcywMYzA1fEOltPs23mv+rfcYFz2FAK5nHof4b+oTfLJQRAANDNuSRujwm0fpfjdJRFNWCTAB7X449FAEkj0v1qxIGVDCVzs1kVavcrWo1EYKg1x4Chqmq/awn5W+0YgeG6GzUxyqYWpc9boFxCh633rlEck1+6/1t060Mz1L9JDO7tDua+z9nP8vx3TcwvXs8vw3+qSv0LkKRcDh/sL/icZ3FSGMIoRIyrLddcA+RKlIY3DII4vatJUeog4iY6sskGepiWQZOwEg0VgVhYpFb8ssT9/uTcaZ3WWTNfudTtp0QjTlZL3p4sXcsBuOcrSSxp4EemtoSblHnrfb+8+bwIu5rWzfd8Pd39Max81dTPK2+vj//Hg0QtmVTakRCCsjW7X0AS79sgh5J9Xqu2qxJ3ipdYGr2NMTwhyXQbM7VWFll2p9nEugeXSyns2HZd4zozjDh3rqnmKIubS3xJr4gU9HAkBGg1Cod//uiAKSABCE30Xn4wth2x7pvPw9dDqDdS+xh62ndm+m8/D1tv1Wwaye6ORTnHxJZyupl04NqEPILdCfbvakKfOt7pvGsR5VtzQ/XjCKGJu7Sb37gTss4/I4OwapuE8gkqGCLplUnimWUZu2tsgTsUNQluZL6K5ctRzClYXGCLvH3fEltxoRvIO80a2tQo10nsuoSwBbHoS61qj3KCQMK2se8t5I88mJHV6X9MTsMGJC+vvX3OrIMGyYdt3a1ec/uTr6AzSRLjn/8BrCUMist4pFlSzpyODA0E0qzwiHbMZvxOMMQJrwEzSNO7AFNKu00BUEqB/p12xTw7Ubn6rIUfcVx14Fo93vgp4t4i6XgJu7KuIMpykEYrwNxtI1nw+eStDFi+qXmhp5zv6V1reN4YklHHtlqMSIARVW226UDkxdUGoyUi3JTFmlQSosoDTZQG1Kfr331nIioaRIKFQJYvQ9VpI9LY48IhQaCFWdwH8dVtVE+cTMZcXXpbzNWz4L8kB5OKqxZ7qCynTZXa3RzaI7XuI5TQvExqmN325RrZ1r6+vSLkcAkUFQw7y1ZJBcT/7gMyPx/VFvBqxixZfDTDmKMU0Bq5opFfuOnDcwDo35yegW5J4BabSSRebYQORiP1Sq89js3nqGYvLhW0isU94UWChq4LiEeUSsS71PQYbdIfp0zQM7lcXKNEv/7oACkAAOMN1RjGHrcd2bqP2MPWw7I50uH4et51Jto/Yw9bCs876L/qLnuEj6SLfOPjsppsKst7Q8rWhEggbo1119wEyw6u0Z9xVV5NV9W5xRVQnPFrMP1twiiiT9RZywo522WQJhVxfWxAE1XZchA64loVdQZ2p0XEgqqtek0Bing6OQQ05iXxlNLLbO1KQwuNK5hd5RzdVi5lre8OSmnrjEmrTVPv/LXsGnm+a36QIQRIBNjWaXaAD1YRNUyIYLwcY8GZwEjQ3TpfiLL2xlsSgFneDIjOKOuzaeyrA9ztmbha/IVm16ln7EZ7bDitwuSw6pfFWKItvpyEj3Ak35qLSKa22WBMQR2x3VD6HG39SppXUWKXj1srnsdujfdNb+4reg9KV2pGgkrO1+29wEZgq41WVCilpKrMNh2Xp3BIGn34Dfikge9HqRENuAkxQBncDP5FqW/L52ApKrpMpZmVl3z1gScJpMIYzFAhR9bZIuZ7HOJEfjllmrfUQhapjuTdK4NcRiiabZHKA89IOo1caZnf1//qunKAFpF1ooxXRLEIgBqaS3XPAPIMYgdSXC2mcIETJOBfia6SWsxgSu82b9yGaC4QNQvzXjGMYisNbtxmHxlL3PPAEvtVpyIU8++kNO+/tff51Lkeld9pSPrCwhz+QhgU9T3+Njyl8vn91ZRQ0VintZSqf/7ogCsgAOtN1D5+HraesbaP2MPWxAc20Hn4wth1ptofYw9bAy2zZr43rVaRRiT/hv/1+/zuDn3XJnvcqYEjEldVlu2mArVaZYGgIVOMrlZj/uWVYJpx1334nXcpozA12DUOxhUJVe5l+T5zcpna0qplXiNK2z+aSLFp0WSEvLC401vxYba7PFRH8OFjXTO29qlLJhVziuK6ZcxXPyQvvXzrGoMkkOFrdfr+u4OXMTy/9aNEgNp19IHcqjHG3QTB6HURggVrBKlIbGcZ6ueQttBD1xHGkMqNpsdZTk4WLSnuh6HlyLYBfoWrnk3gw0a8YCVE9dNWXzbGYoUCErT0QkTYegepXMjxTsCwgUarmuC2Ob9W53luh0pT7rC3iDqFfds5+bywLhiuuRQiZGjqsv/0AGXG7MD8gQ01Q5oDK26jOFoRyBl0NczcV7YnOQ9HUuxYqtcKnrMSp7MqrwQkYMbbSoK6bOxIajy5KZleRdRYsVx1Z4pkwBoOKgZ2GZsgkEN5iVEe0RKqUuDzfhSN9s/WrSPWOFArv/H/9Jp76jSQCjjbjZAHrcfSvM41AXYuKEMwgpOSBPgmJdk1l011W1ZjfZCppUNKcOg6bew0/zqquX4JiyvYYz1ySRnB0FV261MLOH14FfyfdyiL+BlQERFFhKazH42+M84b6SGG4zD2HbkCwZb3Xzv173/+6AArIADvTbQ4xl63nTm2g9jD1tPoN1Fp+MLcfcbp7WMYW37wyzrTcJv7//1/9+cpOqan4Bgu2zb7MAYcm1OqUqGWowp/V0NPUUTyTYlrdF/zDNrUXjKQqAwxtaswR0nklr6boLkhepMpdrkulGYw7kqh6ijb7thWGlO8s7sVqxaER6jT4JEDRVusjeahu9ybq8z/1Jqcmbvs5h+W43Lsfms8se9w3YnP7/cf//zrUupwIkzMSSGff/+gDm2ks/nx0SFJYQiUtCC0jTo1El2I62axFoZikEPEF3lyRoqz33ijxsjbhH43UZ6Osn4tTdgCLOVAEzemF4OtR0u8tV7FHYlVtuQjWWncuYga9PYS2hoLUM7yynaaMximu0s7V53L8LHNwzGd1vi/cMEvykJQDjn/yB9V2Vb6cVcsIu4jVDVGooiPhhDSglCzmGGuPEuaKkX21d9+adhr/yaQV7bWhhB4nIl41GxC2vKmPchcBRYxiNP81hFCUS+KxRFzRzGn4qnOVVKxWR8qlzZoEfWIu5q0/xrw49NV167//msJpOQkAJp19AEN+TN0ehWBKhHhFGpXgk1a4Fsu202UVLLU2muCKBGUr1dqXSBoritneqrAa11YgaMeFWDGgQC2zJ0yBtGuypjbS0t1YpuoUQcFKX05kOYVUzQYqZL6Tl84RIzO/vHvK1Llxn/+6IAq4AD3DJQ+xjC2nKG2hxjD1uPKN09h+HrcdIYp3WMPW3tXdp2ZuOqR9/XX+PqZx+HfCiTNL9vrABZrSVkL0qZHQIgEhtDzhKVjtnBduHFQUkcdydhmUlqhvKiDCrLXKK678NQ3GmVyoNxXqtT0XUVNlikIG8cm5r3DjUswxXQQEegUJ1qBgKaZ+oVyIOrqn7Rma6sEGDf6lWcf63SWsGNQV7+phyEkSRLrjcjZAH9ShWgMwRoEyNorkYAyk5GWTb3M9lNx6ZE3BjRbAzHjK3HChuHYcm3pd6lZIhKWZB7/fSzdh2YYvxukcJrUjuS+QW8Ka1Zh1bIocgUzd1dN3wlNR/1bXVjcR13POmkN+Rdl8t1Vq437e+UVez/d6//3y/akRJCjn/wBqMnRm6DBFSdwmLQqQgAm3sxArLcYEaI37H1OEUDXVprAlhn7gRusZgqHKdIwLBekuVKQeWjxlAxMaECgYVc+pWNZ1aQ7W4HcaUQ6sw2hEl1H2oVkn8ZDVIqU9Eh+9Larf+FfMSFH0/tC7hJKccckbIA/6ZksMlqCICd5Ma/DaLhrTo4RdCaw5/W1eugcKdAsAtqj8ypPqSSxXzXmwPpBazQsgNNbBD8faC8z/zMaaYqqni+Msf+WUF2ijdPD8nkCfJBcpSikrAprV+0+rpslaS2CNWqedlj/y6VYcotU+Oe//ugALEAA9g20On4wtxwJinsPw9bkQDbPaxnC3nwm2f1jOFuGFi3NQfP55d1jz/xwp+jr86IiiZJHJGyAP+gZ5TFXqZrhoAGxQSgQLMutGWlRlMVsr+wQ3JAMCVznZHqUKYGsUs9E4hqlcBOV11Qu+51LAdZ0HSu0zEmCUe+2P3ZjFLIWYyNENAyTRSNvxfsYucRGjVBXqyx/qszRax7Jq1z9933lLP3qXv85/P//vkKAHCWSq45I2QB/voj3KhUSlK7FyNrPiAJxh0kJguK2Y0/TI4zEWnmjMLWqbO7FMLj9w46cMrmdhdC6IfbDD8w+z9wuclas8eeSDZ6S4WKSgsXMFDiJgt5iLHHMqdtV4FlEbiL+y+ZtVZRJ5u7uvhju1ayv3p173umeY8///+YVUULICQgbs13+rAHwnylVIJEDVGKLPQzgjQT5uM7SwiTJhQ+9j6vQpmbqk00NZPJdzksoZTbVXBQyKTqvDbmozhKIm679xN3XlkVbKnoJihqVZS2jEWROvSwvk9ciD/R2H4RJLF/KOwZlvv1rf/h//+6Sdf0PW2S0VE5JGyAP+YaLPjpiYUwn+ryTKLg+JptVy3kzhUqjrU7T8mMmmDDctzl1EwOJNP6l2tcWxuNP9Nu7nBLSardJaps3Ghlc5nEH7ikvjMMQEJDB9ltJjOA4zyx16GALCRJpuUW//uiAKwAA/s2z+sZwtx0Bhm/PxhbEAzbPaxnC3HOmGf1jD1utyqNvJlZwpKCan8K1JutdrR3Kt/4b//327PIolJaUsskjZAG88lH6iHoQSOl21oM8EIU+mbtXaUu24mazaNuMwBzCWg0svlEGSO/AMImXXbmoKYkjNHy5HQwqhVRmCKLqhI4Xzy97OTuBNKujyJsPQXwmD/GWFwKIV5UqGaND2z1ZZ54usQc/WKYYPEc/UKAeJpL71v2qAH7ml5Q6gFVIqin0nyz4d2OggGHWAkxail8BrGTNoIMOMpl2JpgLaPo7rgzGn6LRCzjUpQzGkm+QTA72NMY8UAttUhVO3emnZ6r9ZsVU7BI41t6mbROGHYd9Z7D6sVlVW1HHipK+de3TcxzsfhctRrWt95l//+sL5mhwBEuSNuJAAYpYLh2CjCIUoIoekMYXpFO90uUigdInnkkbRVYOAgwBokUtd+mavy5LrQNIIEsiAYSB6wa7SUtnCRUUFRp5Yvb7WxpIDkEugetAMvOAVJl+IFs3quTWWTQmW7xztzVTXNd1nW7zuX93Q3rvpcAaDs229hAH70wiPINI0KpjcV+wKgPGwWQW3fhe3Ul0FIvKxFqjqFIkY1D6qjvt1UEZ3D7gDoQqCNBjL5YQf8XlDqRGB4oqSLfM4S6GJVbnos0MYMAxGIcCv07soba11gMy//7oACrgAQGNsxrGMrYc8YpvT85W4/I2y+sZwtp0xindYzhbliaszGVmfotfjnVpc+4/2pndlc7e/v6///v3mRCUVLLJI0QB/1kTpWQLGitlWRJo6kcNKXljrCJ4LkX1BUprqUsEOMtMEHDyB1FXQvDktgyUIfBGEqZXPyCYfeiYhL+wU8kanr8a+UQxHtV3QcNdyv2rs9b+JzuUckTgu3CuRuZsxitzDm+f/95/f/CvxpvSQAIIwEVhY//1QA/4MZfTFukNC+hMCHoaEaigFpNd9BYikLhtYcSVW09Cl4iEWSsCvxpT+OZVdxdjBSJAHQL9M5ex9IKdDNd19iMLbA2eXUtLXvzGc9nKGUo8J4ted9/eQ9RZs+eulldyrQ2W6yCr+WOeVv/13fbuc9hvv///+606hIpKbltkkaIA/4/EeiApQy2qxdTSh0YeBGFvMnQBpHF8W4afpVE7mYSmc56gsbaw8Tavkz18JYGAB2Vn0ExBURmIk/UKfWIRmM0kpp86lmO8zjMEw4GamZAyajm6mTWVPu1Zns+2dWc+/nzu+/z//6X1p0iYwBAuOySRoAf+0iNDAhJMqEip9P8X0EnkA0uDACAGLOgv98EJKuyU84gigUeOTnL9BQQeDZelhAxYKumTUTAQBvLDETxjk7FZhp8F4vfnTYcu6g3W3+nR14CIt1uEWoX5v/7oACqgAQHNsx7GcLYc6YZzWM4W48cwy+sZwtR0hhlfYy9bFe4CgmD6LlPM5OxM4a5vnPx3/P79u8zxADiAiSPEfbWAAf7c2RPQIAkzaoQFfDklUQObRFf1LRETAaFhGKu0qAbcZTBgDGAM466Yk4bMHJag1skKNUsDgcB1NKcO525Hquoh4nu6UEloS6OqaeK0J8k6+Xk42tmbY7YbxxqiDChx4uLwrU993v/itbVjFSmTLLJI0AB+U8KigtO4XkHDJArXmxCgmUh2dgBA5+kaIZfodCaKHCnGitdFJ0GhiwbQIuwGVPEzBx1WNycRx4dl0kruvGYozWLQ1qBOzMrmI7VqtjT2KoQ5swqOCJQ13UVi6sVWKVsrE5ajFzWv/PKv+Ou67eFOsoaBhFBFXiNrYwAP+hkESRdGzQgQLDRVzQKGAwl5SjIaBgZnTjQy+4y0FEh9oFToAi0LAXTSyUdaPFYg2QMEEKMhhbFzCur7seLsbDau7N1s1eKeh+sZqpR1iN8mGoliNCml2yvexyz/0RDRCWTY5G2iAB/2EVqoogyigUyEWBk5VATHrs6WvEii4gODi8pYTcVsEOgkEuVq1O0WkQnN+penKX0DxwagzmFOE5bcWb6t705Dxg2vHgz+VtcVADuBfgfy4tZ+zQ7rCda3mG97Bbaz7Wlxxc2DAJCLvD62xgAf//7ogCsgAPQME1rGcLcaUUpT2cvW010pS+sZetxnpSlPZy9bc0OhZjAIPRHQw4tr0AgSkDFwFF0vnCMUBlbsSGHUoQbMbCx4uQSwB12lSVmO4agVpKGQvkJ6utuI2QoVYTXaSE/xrdbR6pphUZ/ONoMtKxTncHUfGKxqzEqUbP8pUAIRDAYiI/3sIA/4YRtrl2ggSbQZt06JJwSCU4uM1LOP4i84E2kJYGHjsTQJLVXjNTzovxBGUjl4IRALwZcmSYJ8pmBFDM4ShAR1LNTA4tIwLhocOjYBvwewRcXMZFgzOmJAiKjuJ81qdFBVJJ7qXutZmgr/mSP////////////////////////////////////OaQP32trQAH6qpDOuFgychpaLTcWxCgJlEK2z5d8tuueKxN3qFgZC4eQaf7nqcReEU8MSiNMibgEGWFgeWcnZfJ7NPF6OWuxUzt8s4WssMakUwfR85fMb5hjKXv/n3PFQwgs/mgYyESaHja6MAD/oHqdoOJIxEhgwbb7ioZ6CIoM2dsWPd8IJbE5EuqhVgD7DTbC0hm5whv9l1eRRkCAoSfcdhULPEYW3FIeJ8Y1rUDfunjnBnhBjLfpyz19dfpM9rnM3ihgTT2gIip0m3ayRoAD/uPrARgxixCmi3y9K/hkYsGl6IsrCLDQq5dk0rV9AZ1xCWa2n1b/+6AAxIAEiDZLexmS2GTE6T1nOEsMpKMr7OXpYXeTpLWcvSyzDEaVynT7UJMLSeDFBw0PaagOUWFB3ferYfZtfxVyad4dYW75XbTt7a0I62070jwUlA3ayStAAf+TAYBGfFrWVixKjPRYEzj4wzYqhhgEScaBpWwuNrsOpCCcnuilFB8bsYXoHoNyyMTeeOVSMVPjcP0/PyrZ0n2tyqAiF5diHeP3XrW9YzOFN9//t6QrbUJP//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8Uqt/fWSsAAf9HEnjCh0wArEKDY0y4EniEJ12vIZl/14xKV1J2sXaBcgkPI49EORdfbFMc6MRDK2Wi3v8PYWJLW9/rdaZ875ZDobXFz195caPvd8opMJ+2skRAA/7bIGIjqCaaVZQRLRgBCEGHWLS6w41TbGQOq40PrfMe9g7NmUSWVOgZSZVsNJg7g3F5vivY0aEm7Vexo16U3C3e1H78pTpZlM1Rz6BOWe7f0UlOa6yNoAAf8AswggVOpcgJBUJgOClJ1BrQL5kyDQ7/+6IA2wAHUCjJaxnCWFPkuT1jL0tLFIklrGXpaUUTZHWMsS199MJmHqVHBNIxg43Bs5RVoygpSm48m6r1iu61qfm969aZnt7nvMhS4qadmc5A2Y5uhBCWnZpG2QAB/7cKCQuUfEuUrGupviEA+U05n6aaLFW72EzMuKBYTbEJo5Vcr8giU5mOjwBbbWGlI0CS0G9lJChU1bfpLW8JWG2WB9JLv5pTzdZv////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wyATXZ1IAf9fJ4UOqcSi4+WAmAhQwMO1BrbqoiKaX8pz3dS+VtDEy2M540ZhzCIAjICQNa4aaaqGmNW0zf7knAucQ6v2GGpGA0E2QY4uqAD/xbqywAVg4BXJaBZ70FrTpORHhxYyYENxOlzjL/qtOABY1nn3pHZWUgH6mCuta2P9tm5n0ONT6viut5outDx0wT1znVaxdIoFW66VQA/87DphTSpgIIIC//ugANqACGolyGsZelpJJKj8YwhLCdyXG4zl6UD/EOMljC0g0YKDCtkehAZUHIF1EMcquT6BU90TF5mSps/O8gj626pp8RnWTXcz/zZJSbS74aaMCaJMcfUgB/5zrWAIFB5FAKOg09hYRfsLBX9QqlXhRSjCXyGWBUAhi0djhVTEHUaO/cRMi9R8f79vi0KLb//Xp/7OcF89G24WKf/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////isu9KoAf/zbOB2inZbARkgB2wYAPxsRabFVfy67/9g9aTetsOtdY4hMNRHsFF63xtv+bfx/19JKLHSeRcRBJLbUVUgB/7qU5KZD1IYuFIkZi9Imuy5msZeSQzuGsnfUpK2ZExCw4wbQlYChOOa59pdiaTj/qfgQgDHCz10hONJqKmQA/9//uiANsACYshRuNYekI9ZBjJYytIB+SFG4xlCQDoECNxjJ0gxFVqIRa8jOmzJiQASCH1l408Fr++zrV+EPosRJsasrjzMxpUNDBjvo/Q3/zSpcfWexgEoytRYB/XqAEgDTAZURcE/CsJ2UQyQCUiva1vX1sU7xCh5J7tjd6k73e36jF4OiTt7IiEK//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////xvrelQAP/7FIghAzAMh1IJbUtqdRykHYhtWKxljj8Qm0FoU5JSh89DxMAKLjKfuh1P7T1JgtyRqKVAA//xjD7h5cOpIMETsYedx7BXJiD9YJJOpAPZAZUgiRoikffWcWCjMmtPv/7oADagAqEE8bZ+MHINGQIyWMnSAZ8SxuM5kbAr4mi7Zw84JFRMFAHE2ijAH/+cFKDBJqD7WayCYvcZOufJ4LbTG/+Gc8IMxykxb/4+qQLnf/g0AY5IkzoHOkEArolwcIOzDUBIdT6BYaLcouLcSkYi0k9m96P+sqb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wXG201AgAf5ka0NEUEOq1HFEbCJTwReUu7ex/PkAxFO41tydpzv/+JVguOIlKQP0SsMQP/7ogDbAAwYDcbaWFmwKSJo3D8GOAPwNRtlvETAcYajbCwsmIociWWCXEFmpZXr5AECCoKazv/1oJgKKRFnAOjCIcX1J9QgYMJ6kdVJS/82HgDR5nUbAUcaCPsIV6rqZ1g1ND0iJjlBvxgvJ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+6AA2oANuQzGoPgpOhLhmNQF4idCADUWgSRE4CqCYxABBEz//4BibJR8mXYkV4TAfxTRcd+zgQ4AopAEfEkRMnJMKgStf/AnAKIABEGJCkz1rGj/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+6AA2wAPMABLgAAACAAACXAAAAEAAAEuAAAAIAAAJcAAAAT///////////////////////////////////////////////////////////////8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");  
	snd.play();
}

	


//-----------------------------------------------------------------------

/**
 * Class for the Vinci-related blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */

const SEND_SERVICE = 0xFFE0;
const SEND_SERVICE_CHARACTERISTIC = 0xFFE1;
//const Bluetooth = require('node-web-bluetooth');


class BleConnection {
	constructor(device, characteristic) {
		this._Device = device;
		this._Charac = characteristic;
		this.stepSize = 100;  // defalt
		this.cmdStarted = false;
		this.cmdEnded = true;
		this.pgmStarted = false;
		this.pgmEnded = true;
	}
	get Device() {
		return this._Device;
	}
	get Charac() {
		return this._Charac;
	}
	get pgmStarted() {
		return this._pgmStarted;
	}
	set pgmStarted(started) {
		this._pgmStarted = started;
	}		
	get pgmEnded() {
		return this._pgmEnded;
	}
	set pgmEnded(ended) {
		this._pgmEnded = ended;
	}		
	get stepSize() {
		return this._stepSize;
	}
	set stepSize(stpSz) {
		if (stpSz <= 500 && stpSz > 0) {
			this._stepSize = stpSz;
		} else {
			console.log('BleDevice: setSize: MIN=1, MAX = 500');
		}
	}		
}	
		

		

class Scratch3VinciBlocks {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;


        this._onTargetCreated = this._onTargetCreated.bind(this);
        this.runtime.on('targetWasCreated', this._onTargetCreated);


		// Vinci:
		
        //this.vinciDevice = void 0;
        //this.vinciCharacteristic = void 0;
        //this.vinciConnected = false;
		//this.stepSize = 100;  // tamanho do passo na tela
		//this.cmdStarted = false;
		//this.cmdEnded = true;
		//this.pgmStarted = false;
		//this.pgmEnded = true;
		
		this.connections = new Map();      // connections: mapa de {key=>targetId, bleConn}
		
		this.waitPgmEnd = this._waitPgmEnd.bind(this);
		//this.handleCharacValueChanged = this._handleCharacValueChanged.bind(this);
		//**



	/**
         * A toggle that alternates true and false each frame, so that an
         * edge-triggered hat can trigger on every other frame.
         * @type {boolean}
         */
        this.frameToggle = false;

        // Set an interval that toggles the frameToggle every frame.
        setInterval(() => {
            this.frameToggle = !this.frameToggle;
        }, this.runtime.currentStepTime);


        /*
        // Timer para o ping:
        pingTimerId = void 0;
        setInterval(() => {
            if (this.vinciCharacteristic) {
                this.vinciCharacteristic.writeValue( s2bufnl('PING') )
                .then( (resolve, reject) => {
                    pingTimerId = setTimeout( () => reject(new Error('Ping Timeout')), 3000);
                    return this.vinciCharacteristic.readValue()
                })
                .then( resp => {
                    if (buf2s(resp)=='PING')
                        clearTimeout(pingTimer);
                })
                .catch( err => {
                    // desconectado:
                    this.vinciDevice = void 0;
                    this.vinciCharacteristic = void 0;
                });
            }
        })
        */
    }

     /**
     * Create data for a menu in scratch-blocks format, consisting of an array of objects with text and
     * value properties. The text is a translated string, and the value is one-indexed.
     * @param  {object[]} info - An array of info objects each having a name property.
     * @return {array} - An array of objects with text and value properties.
     * @private
     */
    _buildMenu (info) {
        return info.map((entry, index) => {
            const obj = {};
            obj.text = entry.name;
            obj.value = String(index + 1);
            return obj;
        });
    }



    /**
     * @param {Target} target - collect vinci state for this target.
     * @returns {vinciState} the mutable vinci state associated with that target. This will be created if necessary.
     * @private
     */
    _getvinciState (target) {
        let vinciState = target.getCustomState(Scratch3VinciBlocks.STATE_KEY);
        if (!vinciState) {
            vinciState = Clone.simple(Scratch3VinciBlocks.DEFAULT_vinci_STATE);
            target.setCustomState(Scratch3VinciBlocks.STATE_KEY, vinciState);
        }
        return vinciState;
    }

    /**
     * When a vinci-playing Target is cloned, clone the vinci state.
     * @param {Target} newTarget - the newly created target.
     * @param {Target} [sourceTarget] - the target used as a source for the new clone, if any.
     * @listens Runtime#event:targetWasCreated
     * @private
     */
    _onTargetCreated (newTarget, sourceTarget) {
        if (sourceTarget) {
            const vinciState = sourceTarget.getCustomState(Scratch3VinciBlocks.STATE_KEY);
            if (vinciState) {
                newTarget.setCustomState(Scratch3VinciBlocks.STATE_KEY, Clone.simple(vinciState));
            }
        }
    }


    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: 'vinci',
            name: formatMessage({
                id: 'vinci.categoryName',
                default: 'Vinci',
                description: 'Brincando com robots'
            }),
            menuIconURI: menuIconURI,
            blockIconURI: blockIconURI,
            blocks: [
		        {
                    opcode: 'moveVinciForw',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'vinci.moveVinciForw',
                        default: 'Move \u25B6 [STEPS]',
                        description: 'move forward'
                    }),
                    arguments: {
			            STEPS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
		            }
                },
		        {
                    opcode: 'moveVinciBackw',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'vinci.moveVinciBackw',
                        default: 'Move \u25C0 [STEPS]',
                        description: 'move backward'
                    }),
                    arguments: {
			            STEPS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
		            }
                },
		        {
                    opcode: 'turnVinciRight',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'vinci.turnVinciRight',
                        default: 'Virar Direita  \u2BAF [STEPS]',
                        description: 'turn right 90 degrees'
                    }),
                    arguments: {
			            STEPS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
		            }
                },
		        {
                    opcode: 'turnVinciLeft',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'vinci.turnVinciLeft',
                        default: 'Virar Esquerda  \u2BAD [STEPS]',
                        description: 'turn left 90 degress'
                    }),
                    arguments: {
			            STEPS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
		            }
                },
		        {
                    opcode: 'moveVinciDiagRight',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'vinci.moveVinciDiagRight',
                        default: 'Move DIAG Direita \u25E2 [STEPS]',
                        description: 'move diagonal right'
                    }),
                    arguments: {
			            STEPS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
		            }
                },
		        {
                    opcode: 'moveVinciDiagLeft',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'vinci.moveVinciDiagLeft',
                        default: 'Move DIAG Esquerda \u25E5 [STEPS]',
                        description: 'move diagonal left'
                    }),
                    arguments: {
			            STEPS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 1
                        }
		            }
                },
		        {
                    opcode: 'blinkVinci',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'vinci.blinkVinci',
                        default: 'Luzes \u26ED',
                        description: 'blink'
                    })
                },
		        {
                    opcode: 'singVinci',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'vinci.singVinci',
                        default: 'Musica \u266C ',
                        description: 'musica'
                    })
                },

		        {
                    opcode: 'hideVinci',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({
                        id: 'vinci.hideVinci',
                        default: '◌',
                        description: 'hide'
                    }),
                    arguments: {
			            STEPS: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 20
                        }
		            }
                },
            ],
            menus: {
                // Empty by now

                
            }
        };
    }
	//---------------------------------------------------------
	//---------------------------------------------------------
	//---------------------------------------------------------


/* async nao funciona - tem que acertar o Babel.
 * Por enquanto vai ficar com modelo de Promises mesmo...
 *   erro: 	Uncaught ReferenceError: regeneratorRuntime is not defined
 
    async vinciConnect() {
        try {
            let device = await navigator.bluetooth.requestDevice({
                    //filters: [
                    //      { namePrefix: 'BT' }
                    //      //,
                    //      //{ services: [0xFFE0] },
                    // ],
                    acceptAllDevices: true,
                    optionalServices: [0xFFE0],
                    //delegate: new Bluetooth.InteractiveRequestDeviceDelegate({
                    //    header: 'NOVO TITULO',
                    //    format: (device) => `${device.id} - ${device.name}`
                    //})
                });
            this.vinciDevice = device;
            //console.log('XXX 1 - device:');
            //console.log(this.vinciDevice);
            server = await device.gatt.connect();
            //console.log('XXX 2 - server:');
            //console.log(server);
            service = await server.getPrimaryService(SEND_SERVICE);
            //console.log('XXX 3 - service:'); 
            //console.log(service);
            charac = await service.getCharacteristic(SEND_SERVICE_CHARACTERISTIC);
            this.vinciCharacteristic = characteristic;
            //console.log('XXX 4 - characteristic:');
            //console.log(characteristic);
            await this.vinciCharacteristic.startNotifications();
            //console.log('Notificacoes iniciadas');
            await this.vinciCharacteristic.addEventListener('characteristicvaluechanged',
                                            this.handleCharacValueChanged); 
            await this.protocoloConexao();
        } catch (error) {
            console.log(error);
            alert(error.message);
        } 
    }
*************/



     /** Connect Vinci
     *
     * @returns an empty Promise after the connection
     */
    vinciConnect(targetId) {
		vinciDevice = null;
		vinciCharacteristic = null;
		
        return navigator.bluetooth.requestDevice({
            filters: [
                  { namePrefix: 'Vinci' }
                  //,
                  //{ services: [0xFFE0] },
             ],
            //acceptAllDevices: true,
            optionalServices: [0xFFE0],
            //delegate: new Bluetooth.InteractiveRequestDeviceDelegate({
            //    header: 'NOVO TITULO',
            //    format: (device) => `${device.id} - ${device.name}`
            //})
        })
        .then(device => {
                //this.vinciDevice = device;
				vinciDevice = device;
                //console.log('XXX 1 - device:');
                //console.log(this.vinciDevice);
                return device.gatt.connect();
            },
            error => console.log(error.message)
        )
        .then( server => {
                //console.log('XXX 2 - server:');
                //console.log(server);
                return server.getPrimaryService(SEND_SERVICE);
            },
            error => console.log(error.message)
        )
        .then( service => {
                //console.log('XXX 3 - service:');
                //console.log(service);
                return service.getCharacteristic(SEND_SERVICE_CHARACTERISTIC);
            },
            error => console.log(error.message)
        )
        .then( characteristic => {
                //console.log('XXX 4 - characteristic:');
                //console.log(characteristic);
                //this.vinciCharacteristic = characteristic;
                vinciCharacteristic = characteristic;
                return vinciCharacteristic.startNotifications().then(_ => {
                    //console.log('Notificacoes iniciadas');
                    vinciCharacteristic.addEventListener('characteristicvaluechanged',
                                this.handleCharacValueChanged.bind(this));
                })
            },
            error => console.log(error.message)
        )
        .then( _ => {
						// Armzena conexao no mapa de conexoes:
						let bleConn = new BleConnection(vinciDevice, vinciCharacteristic);
						this.connections.set( targetId, bleConn  );
						//console.log(targetId);
						//console.log(this.connections.has( targetId ) );
						pr = this.protocoloConexao(bleConn); 
                        console.log(pr); 
                        return pr;} )
        .catch( error => console.log('vinciConnect() => ' + error.message) );
        
        //.then( _ => {
        //        console.log('Sending AT...');
        //        //return this.vinciCharacteristic.writeValue( Uint8Array.of( 65, 13, 10 ) );
        //        return this.vinciCharacteristic.writeValue( s2bufnl('AT') );
        //    }
        //)
        //.then( _ => {
        //        console.log('Sending RESET...');
        //        //return this.vinciCharacteristic.writeValue( Uint8Array.of( 65, 13, 10 ) );
        //        //return this.vinciCharacteristic.writeValue( new Uint8Array( [82,69,83,69,84,13,10] ) );
        //        return this.vinciCharacteristic.writeValue( s2bufnl('RESET') );
        //    }
        //);
    }
	//---------------------------------------------------------
  
 
  
    handleCharacValueChanged(event) {
        //console.log('>>>REC<<<')
		//console.log(event);
		//console.log(event.target);
		
        let value = event.target.value;
        //let a = [];
        //for (let i = 0; i < value.byteLength; i++) {
        //    //a.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
        //    a.push(value.getUint8(i));
        //  }
		let bleConn = this.findConnection(event.target.service.device.name);
		//console.log( bleConn);
        //console.log('> ' + a.join(' '));
		if (bleConn) {
			sValue = buf2s(value);
			let fimBloco = sValue.includes('!');
			let fimProg  = sValue.includes('*');
			
			console.log( 'R> ' + sValue );
			if ( fimBloco )  { // fim de bloco 
				console.log('fim bloco'); 
				if (!fimProg)
					soundBeep1();
			}
			if ( fimProg ) { // fim de programa
				console.log('fim de programa');
				//console.log(this);
				bleConn.pgmEnded = true;
				soundBeep2();
			}
		}
    }
	//---------------------------------------------------------
	
	findConnection(bleName) {	
		//console.log(bleName);
		let bleConn = null;
		for ( let conn of this.connections.values() ) {
			if (conn.Device.name === bleName)
				bleConn = conn;
		}
		return bleConn;
	}

	//---------------------------------------------------------

    /** 
     * Protocolo de conxao interno:
     *    1 - send "WHO", recebe "CUB"
     *    2 - send "BRD", recebe "OKC" => conectado
     *
     * @returns an empty Promise after the connection
     */
    protocoloConexao(bleConn) {
        return new Promise( (resolve, reject) => {
			let vinciCharac = bleConn.Charac;
			//console.log(vinciCharac);
			//console.log(bleConn.Charac);
            if (vinciCharac) {
                //console.log('Sending...');
                vinciCharac.writeValue( s2bufnl('AT') )
                .then ( _ => {
                        //console.log('Sending RESET...');
                        return vinciCharac.writeValue( s2bufnl('RESET') );
                    }
                )
                .then ( _ => {
                    console.log('Sending BRD');
                    return vinciCharac.writeValue( s2bufnl('BRD') )
                             .then(_ => resolve(true) );
                })
                //.then( _ => {
                //    return this.vinciCharacteristic.readValue();
                //})
                //.then( resp => {
                //    console.log('Received:');
                //    console.log(resp);
                //    console.log( buf2s(resp) );
                //})
        
            } else {
                console.log('protocoloConexao() ==> Sem conexao BLE. Use vinciConect().');
                reject( false );
            }
        });
            
    }
	//---------------------------------------------------------


    isVinciConnected(targetId) {
		isConnected = false;
		if ( this.connections.has(targetId) ) {
			conn = this.connections.get( targetId );
			//console.log(conn.Device);
			isConnected =  ( (conn.Device !== null) && 
			                 (conn.Charac !== null) &&
							 (conn.Device.gatt.connected === true) );
		}
        //return (!(typeof this.vinciDevice === 'undefined') &&
        //        !(typeof this.vinciCharacteristic === 'undefined') );
		return isConnected;
    }
	//---------------------------------------------------------
	
	
	// para teste com os leds em protoboard - Nao e' do Vinci!
    /*
	vinciToggleBlue() {
        const code = 4;
        this.vinciCharacteristic.readValue()
            .then(currCode => {
                const convertedCode = currCode.getUint8(0);
                this.vinciCharacteristic.writeValue(Uint8Array.of(convertedCode === code ? 0 : code ));
            })
    } */

	/**
	*
	*/
	verifyConnection(targetId) {
		console.log(targetId);
		return new Promise( resolve => {
				if ( this.isVinciConnected(targetId) )
					resolve(true);
				else {
					// try to connect:
					this.vinciConnect(targetId)
					.then( _ => {resolve(true);} )
					.catch( error => {resolve(false);} );
				}
			});
	}
	//---------------------------------------------------------

	/**
	*
	*/
	_waitPgmEnd(targetId, segsTimeout=5) {
		return new Promise( (resolve, reject) => {
			let idTimeout = void 0;
			let idTimer = setInterval( () => {
						//console.log(this.pgmEnded);
						let bleConn = this.connections.get(targetId);
						//console.log(bleConn.pgmEnded);
						if (bleConn.pgmEnded) {
							// espera a notificacao que muda esta variavel, ou timeout.
							clearInterval(idTimer);
							clearTimeout(idTimeout);
							resolve(true); 
						//} else {
							//console.log('esp...');};
						}
					},
					500
				);

			idTimeout = setTimeout( () => {console.log('Timeout'); clearInterval(idTimer); reject(false);}, segsTimeout * 1000 );
		});
		
	}
	//---------------------------------------------------------
	
    /*
     * Move the character Forward
     */
    moveVinciForw (args, util) {
        let steps = this.calcSteps(args, 15);

        //console.log(this.isVinciConnected());
        //console.log(this.vinciDevice);
        //console.log(this.vinciCharacteristic);

        move = false;
		dir  = calcRads(util.target.direction);
		
		targetId = util.target.sprite.name;
		//console.log(targetId);
		
		return this.verifyConnection(targetId)
		.then( _ => this.sendVinciPgmSteps(targetId, 'F', steps) )
		.then( _ => this.waitPgmEnd(targetId, 8) )
		.then( _ => {move = true; return true;} )
		.then( _ => {
			if (move) {
				let stepSize = this.connections.get(targetId).stepSize;
				util.target.setXY(util.target.x + Math.sin(dir)*steps*stepSize, 
								  util.target.y + Math.cos(dir)*steps*stepSize);
			}
			return void 0;
		})
		.catch(err => console.log('Erro Fw:' + err.message) );

		
/*		
        if (!this.isVinciConnected()) {
            prom = this.vinciConnect();
            //console.log(prom);
            prom.then( _ => {
                //this.vinciToggleBlue()
                //console.log('YYYY - pgm F:');
                //return this.vinciCharacteristic.writeValue( s2bufnl('PGMF..') );
                this.sendVinciPgmSteps('F', steps)
                //this.vinciCharacteristic.writeValue( s2bufnl('PGMF.........') );
                //const steps = 20;
                //util.target.setXY(util.target.x + steps*100, util.target.y);
                })
			.then ( _ => move = true );
        } else {
            this.sendVinciPgmSteps('F', steps)
			.then ( _ => move = true );
        }
		let promRet =  new Promise( resolve => {
			if (move)
				util.target.setXY(util.target.x + steps*this.stepSize, util.target.y);
*/
    }
	//---------------------------------------------------------

	/** calcSteps
	*	calcula quantos passos, ajustando para um limite
	*
	*/
    calcSteps(args, limite=15) {
        let steps = Math.round(Cast.toNumber(args.STEPS));
        if (steps > limite)
            steps = limite;

        return steps;
    }
	//---------------------------------------------------------
	
	/** Envia Programa com 'blockType' de 'steps' para o Vinci:
	*/
    sendVinciPgmSteps(targetId, blockType, steps) {
        blocks = blockType.repeat(steps);
        pgm = 'PGM'+blocks+'.';
		let bleConn = this.connections.get(targetId);
		
		bleConn.pgmStarted = true;
		bleConn.pgmEnded = false;
		// debug:
		console.log('PGM> ' + pgm);
		let vinciCharac = bleConn.Charac;
        return vinciCharac.writeValue( s2bufnl(pgm) );
    }
	//---------------------------------------------------------
    
	
	/** move Back
	*/
    moveVinciBackw (args, util) {
        let steps = this.calcSteps(args, 15);
		dir  = calcRads(util.target.direction);
		
		targetId = util.target.sprite.name;
		//console.log(targetId);
		
		return this.verifyConnection(targetId)
		.then( _ => this.sendVinciPgmSteps(targetId, 'B', steps) )
		.then( _ => this.waitPgmEnd(targetId, 8) )
		.then( _ => {move = true; return true;} )
		.then( _ => {
			if (move) {
				let stepSize = this.connections.get(targetId).stepSize;
				util.target.setXY(util.target.x - Math.sin(dir)*steps*stepSize, 
								  util.target.y - Math.cos(dir)*steps*stepSize);
			}
			return void 0;
		})
		.catch(err => console.log('Erro Bw:' + err.message) );

    }
	//---------------------------------------------------------
	

    turnVinciRight (args, util) {
        let steps = this.calcSteps(args, 4);
		
        const degrees = 90 * steps;
		
		targetId = util.target.sprite.name;
		
		return this.verifyConnection(targetId)
		.then( _ => this.sendVinciPgmSteps(targetId, 'R', steps) )
		.then( _ => this.waitPgmEnd(targetId, 8) )
		.then( _ => {move = true; return true;} )
		.then( _ => {
			if (move) {
				util.target.setDirection(util.target.direction + degrees);
			}
			return void 0;
		})
		.catch(err => console.log('Erro R:' + err.message) );
    }
	//---------------------------------------------------------
	
    turnVinciLeft (args, util) {
        let steps = this.calcSteps(args, 4);
        const degrees = -90 * steps;

		targetId = util.target.sprite.name;
		
		return this.verifyConnection(targetId)
		.then( _ => this.sendVinciPgmSteps(targetId, 'L', steps) )
		.then( _ => this.waitPgmEnd(targetId, 8) )
		.then( _ => {move = true; return true;} )
		.then( _ => {
			if (move) {
				util.target.setDirection(util.target.direction + degrees);
			}
			return void 0;
		})
		.catch(err => console.log('Erro L:' + err.message) );
    }
	//---------------------------------------------------------


    moveVinciDiagRight (args, util) {
        let steps = this.calcSteps(args, 10);
        const degrees = 45;
		dir  = calcRads(util.target.direction+degrees);
		targetId = util.target.sprite.name;

		// teste:
		//util.target.setXY(util.target.x + Math.sin(dir)*steps*this.stepSize*Math.sqrt(2), 
		//				  util.target.y + Math.cos(dir)*steps*this.stepSize*Math.sqrt(2) );

		return this.verifyConnection(targetId)
		.then( _ => this.sendVinciPgmSteps(targetId, 'D', steps) )
		.then( _ => this.waitPgmEnd(targetId, 8) )
		.then( _ => {move = true; return true;} )
		.then( _ => {
			if (move) {
				let stepSize = this.connections.get(targetId).stepSize;
				util.target.setXY(util.target.x + Math.sin(dir)*steps*stepSize*Math.sqrt(2), 
						  util.target.y + Math.cos(dir)*steps*stepSize*Math.sqrt(2) );
			}
			return void 0;
		})
		.catch(err => console.log('Erro DR:' + err.message) );
    }
	//---------------------------------------------------------

	/** moveVinciDiagLeft
	 * @param args
	 * @param util
     * @return void	 
	*/
    moveVinciDiagLeft (args, util) {
        let steps = this.calcSteps(args, 10);
        const degrees = 45;
		dir  = calcRads(util.target.direction+degrees);
		targetId = util.target.sprite.name;

		// teste:
		//util.target.setXY(util.target.x + Math.sin(dir)*steps*this.stepSize*Math.sqrt(2), 
		//				  util.target.y - Math.cos(dir)*steps*this.stepSize*Math.sqrt(2) );
		
		return this.verifyConnection(targetId)
		.then( _ => this.sendVinciPgmSteps(targetId, 'E', steps) )
		.then( _ => this.waitPgmEnd(targetId, 8) )
		.then( _ => {move = true; return true;} )
		.then( _ => {
			if (move) {
				let stepSize = this.connections.get(targetId).stepSize;
				util.target.setXY(util.target.x + Math.sin(dir)*steps*stepSize*Math.sqrt(2), 
							util.target.y - Math.cos(dir)*steps*stepSize*Math.sqrt(2) );
			}
			return void 0;
		})
		.catch(err => console.log('Erro DL:' + err.message) );
    }
	//---------------------------------------------------------
	/** blinkVinci
	 * @param args
	 * @param util
     * @return void	 
	*/
    blinkVinci (args, util) {
		targetId = util.target.sprite.name;
		
		return this.verifyConnection(targetId)
		.then( _ => this.sendVinciPgmSteps(targetId, 'X', 1) )
		.then( _ => this.waitPgmEnd(targetId, 8) )
		.then( _ => {return void 0;} )
		.catch(err => console.log('Erro BLK:' + err.message) );
    }
	//---------------------------------------------------------

	/** singVinci
	 * @param args
	 * @param util
     * @return void	 
	*/
    singVinci (args, util) {
		targetId = util.target.sprite.name;

		return this.verifyConnection(targetId)
		.then( _ => this.sendVinciPgmSteps(targetId, 'S', 1) )
		.then( _ => this.waitPgmEnd(targetId, 8) )
		.then( _ => {return void 0;} )
		.catch(err => console.log('Erro SING:' + err.message) );
    }
	//---------------------------------------------------------
	
	
    hideVinci (args, util) {
        util.target.setVisible(false);
    }


    
    /*
     * Loops
     */
	 /*
    loopVinci (args, util) {
        const times = Math.round(Cast.toNumber(args.TIMES));
        // Initialize loop
        if (typeof util.stackFrame.loopCounter === 'undefined') {
            util.stackFrame.loopCounter = times;
        }
        // Only execute once per frame.
        // When the branch finishes, `repeat` will be executed again and
        // the second branch will be taken, yielding for the rest of the frame.
        // Decrease counter
        util.stackFrame.loopCounter--;
        // If we still have some left, start the branch.
        if (util.stackFrame.loopCounter >= 0) {
            util.startBranch(1, true);
        }
    }
    loopInfVinci (args, util) {
        util.startBranch(1, true);
    }
	*/

}

module.exports = Scratch3VinciBlocks;
//-----------------------------------------------------------------------
//-----------------------------------------------------------------------
