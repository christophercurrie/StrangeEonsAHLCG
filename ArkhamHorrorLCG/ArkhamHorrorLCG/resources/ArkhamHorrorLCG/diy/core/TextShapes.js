// Page shapes for card text, built from points given as fractions of a
// region. Each shape is kept per kind, region and variant, so cards with
// different regions never share one.
//
// Module: returns { install, getPathPointArrays }, where install( o ) adds
// the shape getters to the plug-in's shared object.
define(['se/java'], function (Java) {
    const Path2D = Java.type('java.awt.geom.Path2D$Double');
    const GeometricShape = Java.type(
        'ca.cgjennings.layout.PageShape$GeometricShape'
    );

    // the outline of an investigator back's text, by class
    function getPathPointArrays(className) {
        var pointArray = [];

        switch (className) {
            case 'Guardian':
            case 'ParallelGuardian':
                pointArray[0] = new Array(
                    0.355,
                    0.337,
                    0.271,
                    0.267,
                    0.01,
                    0.01,
                    1.0,
                    1.0
                );
                pointArray[1] = new Array(
                    0.0,
                    0.566,
                    0.566,
                    0.6,
                    0.6,
                    1.0,
                    1.0,
                    0.0
                );
                break;
            case 'Seeker':
            case 'ParallelSeeker':
                pointArray[0] = new Array(
                    0.355,
                    0.322,
                    0.296,
                    0.275,
                    0.01,
                    0.01,
                    1.0,
                    1.0
                );
                pointArray[1] = new Array(
                    0.0,
                    0.585,
                    0.578,
                    0.63,
                    0.622,
                    1.0,
                    1.0,
                    0.0
                );
                break;
            case 'Rogue':
            case 'ParallelRogue':
                pointArray[0] = new Array(
                    0.355,
                    0.326,
                    0.272,
                    0.264,
                    0.0,
                    0.0,
                    1.0,
                    1.0
                );
                //			pointArray[1] = new Array( 0.000, 0.511, 0.511, 0.593, 0.593, 1.0, 1.0, 0.0 );
                pointArray[1] = new Array(
                    0.0,
                    0.511,
                    0.511,
                    0.583,
                    0.583,
                    1.0,
                    1.0,
                    0.0
                );
                break;
            case 'Mystic':
            case 'ParallelMystic':
            case 'Survivor':
            case 'ParallelSurvivor':
                pointArray[0] = new Array(
                    0.355,
                    0.315,
                    0.276,
                    0.264,
                    0.01,
                    0.01,
                    1.0,
                    1.0
                );
                //			pointArray[1] = new Array( 0.000, 0.544, 0.544, 0.631, 0.631, 1.000, 1.0, 0.0 );
                pointArray[1] = new Array(
                    0.0,
                    0.544,
                    0.544,
                    0.611,
                    0.611,
                    1.0,
                    1.0,
                    0.0
                );
                break;
            case 'ParallelNeutral':
                pointArray[0] = new Array(0.4, 0.357, 0.01, 0.01, 1.0, 1.0);
                pointArray[1] = new Array(0.0, 0.468, 0.468, 1.0, 1.0, 0.0);
                break;
            case 'Neutral':
                pointArray[0] = new Array(0.4, 0.357, 0.01, 0.01, 1.0, 1.0);
                pointArray[1] = new Array(0.0, 0.468, 0.468, 1.0, 1.0, 0.0);
                break;
        }

        return pointArray;
    }

    // the outline for a region, made once per kind, region and variant
    function cached(build) {
        var shapes = {};
        return function (region, variant) {
            var key = [
                region.x,
                region.y,
                region.width,
                region.height,
                variant,
            ].join(',');
            if (!shapes[key]) shapes[key] = build(region, variant);
            return shapes[key];
        };
    }

    function install(o) {
        o.getActTextShape = cached(function (region, reverse) {
            var x = region.x;
            var y = region.y;
            var w = region.width;
            var h = region.height;

            var path = new Path2D();

            var xPathPoints = new Array(0.0, 0.0, 0.715, 0.83, 0.83, 1.0, 1.0);
            var yPathPoints = new Array(0.0, 1.0, 1.0, 0.957, 0.85, 0.85, 0.0);

            var numPoints = xPathPoints.length;

            if (reverse) {
                // swap order and x-value
                for (let i = 0; i < numPoints / 2; i++) {
                    let px = xPathPoints[i];
                    let py = yPathPoints[i];

                    xPathPoints[i] = 1.0 - xPathPoints[numPoints - i - 1];
                    yPathPoints[i] = yPathPoints[numPoints - i - 1];

                    xPathPoints[numPoints - i - 1] = 1.0 - px;
                    yPathPoints[numPoints - i - 1] = py;
                }
            }

            path.moveTo(x + w * xPathPoints[0], y + h * yPathPoints[0]);

            for (let i = 1; i < numPoints; i++) {
                path.lineTo(x + w * xPathPoints[i], y + h * yPathPoints[i]);
            }

            path.lineTo(x + w * xPathPoints[0], y + h * yPathPoints[0]);

            return new GeometricShape(path, region);
        });
        o.getAgendaTextShape = cached(function (region, reverse) {
            var x = region.x;
            var y = region.y;
            var w = region.width;
            var h = region.height;

            var path = new Path2D();

            var xPathPoints = new Array(0.0, 0.0, 0.148, 0.148, 1.0, 1.0);
            var yPathPoints = new Array(0.0, 0.85, 0.85, 1.0, 1.0, 0.0);

            var numPoints = xPathPoints.length;

            if (reverse) {
                // swap order and x-value
                for (let i = 0; i < numPoints / 2; i++) {
                    let px = xPathPoints[i];
                    let py = yPathPoints[i];

                    xPathPoints[i] = 1.0 - xPathPoints[numPoints - i - 1];
                    yPathPoints[i] = yPathPoints[numPoints - i - 1];

                    xPathPoints[numPoints - i - 1] = 1.0 - px;
                    yPathPoints[numPoints - i - 1] = py;
                }
            }

            path.moveTo(x + w * xPathPoints[0], y + h * yPathPoints[0]);

            for (let i = 1; i < numPoints; i++) {
                path.lineTo(x + w * xPathPoints[i], y + h * yPathPoints[i]);
            }

            path.lineTo(x + w * xPathPoints[0], y + h * yPathPoints[0]);

            return new GeometricShape(path, region);
        });
        o.getEnemyTextShape = cached(function (region) {
            var x = region.x;
            var y = region.y;
            var w = region.width;
            var h = region.height;

            var path = new Path2D();

            var xPathPoints = new Array(0.086, 0.086, 0.0, 0.0, 0.039, 0.078);
            var yPathPoints = new Array(0.0, 0.189, 0.189, 0.693, 0.8, 1.0);

            var numPoints = xPathPoints.length;

            path.moveTo(x + w * xPathPoints[0], y + h * yPathPoints[0]);

            for (let i = 1; i < numPoints; i++) {
                path.lineTo(x + w * xPathPoints[i], y + h * yPathPoints[i]);
            }

            path.lineTo(
                x + w * (1 - xPathPoints[numPoints - 1]),
                y + h * yPathPoints[numPoints - 1]
            );

            for (let i = numPoints - 2; i >= 0; i--) {
                path.lineTo(
                    x + w * (1 - xPathPoints[i]),
                    y + h * yPathPoints[i]
                );
            }

            path.lineTo(x + w * xPathPoints[0], y + h * yPathPoints[0]);

            return new GeometricShape(path, region);
        });
        o.getEventTextShape = cached(function (region) {
            var x = region.x;
            var y = region.y;
            var w = region.width;
            var h = region.height;

            var path = new Path2D();

            var xPathPoints = new Array(0.0, -0.054, -0.004, 0.179);
            var yPathPoints = new Array(0.0, 0.333, 0.892, 1.0);

            var xControlPoints = new Array(
                0.004,
                -0.06,
                -0.083,
                0.006,
                0.088,
                0.047
            );
            var yControlPoints = new Array(
                0.047,
                0.193,
                0.513,
                0.674,
                0.873,
                0.993
            );

            var numPoints = xPathPoints.length;

            path.moveTo(x + w * xPathPoints[0], y + h * yPathPoints[0]);

            for (let i = 1; i < numPoints; i++) {
                path.curveTo(
                    x + w * xControlPoints[i * 2 - 2],
                    y + h * yControlPoints[i * 2 - 2],
                    x + w * xControlPoints[i * 2 - 1],
                    y + h * yControlPoints[i * 2 - 1],
                    x + w * xPathPoints[i],
                    y + h * yPathPoints[i]
                );
            }

            path.lineTo(
                x + w * (1 - xPathPoints[numPoints - 1]),
                y + h * yPathPoints[numPoints - 1]
            );

            for (let i = numPoints - 2; i >= 0; i--) {
                path.curveTo(
                    x + w * (1.0 - xControlPoints[i * 2 + 1]),
                    y + h * yControlPoints[i * 2 + 1],
                    x + w * (1.0 - xControlPoints[i * 2]),
                    y + h * yControlPoints[i * 2],
                    x + w * (1.0 - xPathPoints[i]),
                    y + h * yPathPoints[i]
                );
            }

            path.lineTo(x + w * xPathPoints[0], y + h * yPathPoints[0]);

            return new GeometricShape(path, region);
        });
        o.getLocationTextShape = cached(function (region) {
            var x = region.x;
            var y = region.y;
            var w = region.width;
            var h = region.height;

            var path = new Path2D();

            // asymmetrical
            var xPathPoints = new Array(
                0.074,
                0.0,
                0.0,
                1.0,
                1.0,
                0.951,
                0.926
            );
            var yPathPoints = new Array(
                0.0,
                0.174,
                1.0,
                1.0,
                0.319,
                0.125,
                0.0
            );

            var xControlPoints = new Array(
                0.037,
                0.107,
                0.991,
                0.962,
                0.936,
                0.97
            );
            var yControlPoints = new Array(
                0.153,
                0.139,
                0.278,
                0.167,
                0.132,
                0.174
            );

            path.moveTo(x + w * xPathPoints[0], y + h * yPathPoints[0]);

            // just create by hand, it's asymmetrical
            path.curveTo(
                x + w * xControlPoints[0],
                y + h * yControlPoints[0],
                x + w * xControlPoints[1],
                y + h * yControlPoints[1],
                x + w * xPathPoints[1],
                y + h * yPathPoints[1]
            );

            for (let i = 2; i <= 4; i++) {
                path.lineTo(x + w * xPathPoints[i], y + h * yPathPoints[i]);
            }

            for (let i = 5; i <= 6; i++) {
                path.curveTo(
                    x + w * xControlPoints[i * 2 - 8],
                    y + h * yControlPoints[i * 2 - 8],
                    x + w * xControlPoints[i * 2 - 7],
                    y + h * yControlPoints[i * 2 - 7],
                    x + w * xPathPoints[i],
                    y + h * yPathPoints[i]
                );
            }

            path.lineTo(x + w * xPathPoints[0], y + h * yPathPoints[0]);

            return new GeometricShape(path, region);
        });
        o.getLocationBackTextShape = cached(function (region) {
            var x = region.x;
            var y = region.y;
            var w = region.width;
            var h = region.height;

            var xPathPoints = new Array(0.111, 0.0, 0.0, 1.0, 1.0, 0.889);
            var yPathPoints = new Array(0.0, 0.204, 1.0, 1.0, 0.204, 0.0);

            var path = new Path2D();

            var numPoints = xPathPoints.length;

            path.moveTo(x + w * xPathPoints[0], y + h * yPathPoints[0]);

            for (let i = 1; i < numPoints; i++) {
                path.lineTo(x + w * xPathPoints[i], y + h * yPathPoints[i]);
            }

            path.lineTo(x + w * xPathPoints[0], y + h * yPathPoints[0]);

            return new GeometricShape(path, region);
        });
        o.getSkillTextShape = cached(function (region) {
            var x = region.x;
            var y = region.y;
            var w = region.width;
            var h = region.height;

            var path = new Path2D();

            var xPathPoints = new Array(0.0, 0.015);
            var yPathPoints = new Array(0.0, 1.0);

            var xControlPoints = new Array(0.053, 0.088);
            var yControlPoints = new Array(0.307, 0.6);

            var numPoints = xPathPoints.length;

            path.moveTo(x + w * xPathPoints[0], y + h * yPathPoints[0]);

            for (let i = 1; i < numPoints; i++) {
                path.curveTo(
                    x + w * xControlPoints[i * 2 - 2],
                    y + h * yControlPoints[i * 2 - 2],
                    x + w * xControlPoints[i * 2 - 1],
                    y + h * yControlPoints[i * 2 - 1],
                    x + w * xPathPoints[i],
                    y + h * yPathPoints[i]
                );
            }

            path.lineTo(
                x + w * (1 + xPathPoints[numPoints - 1]),
                y + h * yPathPoints[numPoints - 1]
            );

            for (let i = numPoints - 2; i >= 0; i--) {
                path.curveTo(
                    x + w * (1.0 + xControlPoints[i * 2 + 1]),
                    y + h * yControlPoints[i * 2 + 1],
                    x + w * (1.0 + xControlPoints[i * 2]),
                    y + h * yControlPoints[i * 2],
                    x + w * (1.0 + xPathPoints[i]),
                    y + h * yPathPoints[i]
                );
            }

            path.lineTo(x + w * xPathPoints[0], y + h * yPathPoints[0]);

            return new GeometricShape(path, region);
        });
        o.getInvestigatorBackTextShape = cached(
            'investigatorBack',
            function (region, className) {
                var x = region.x;
                var y = region.y;
                var w = region.width;
                var h = region.height;

                var pointArrays = getPathPointArrays(className);

                var xPathPoints = pointArrays[0];
                var yPathPoints = pointArrays[1];

                var path = new Path2D();

                var numPoints = xPathPoints.length;

                path.moveTo(x + w * xPathPoints[0], y + h * yPathPoints[0]);

                for (let i = 0; i < numPoints; i++) {
                    path.lineTo(x + w * xPathPoints[i], y + h * yPathPoints[i]);
                }

                path.lineTo(x + w * xPathPoints[0], y + h * yPathPoints[0]);

                return new GeometricShape(path, region);
            }
        );
        o.getKeyTextShape = cached(function (region) {
            var x = region.x;
            var y = region.y;
            var w = region.width;
            var h = region.height;

            var xPathPoints = new Array(0.0, 0.0, 0.1, 0.9, 1.0, 1.0);
            var yPathPoints = new Array(0.0, 0.925, 1.0, 1.0, 0.925, 0.0);

            var path = new Path2D();

            var numPoints = xPathPoints.length;

            path.moveTo(x + w * xPathPoints[0], y + h * yPathPoints[0]);

            for (let i = 1; i < numPoints; i++) {
                path.lineTo(x + w * xPathPoints[i], y + h * yPathPoints[i]);
            }

            path.lineTo(x + w * xPathPoints[0], y + h * yPathPoints[0]);

            return new GeometricShape(path, region);
        });
    }

    return { install: install, getPathPointArrays: getPathPointArrays };
});
