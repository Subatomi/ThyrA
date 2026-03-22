// import React, { useState } from 'react'
// import {
//     View,
//     Image,
//     Text,
//     StyleSheet,
//     LayoutChangeEvent,
// } from 'react-native'

// type BBox = [number, number, number, number]

// type Thyrocyte = {
//     bbox: BBox
//     confidence: number
// }

// type Cluster = {
//     bbox: BBox
//     num_thyrocytes: number
//     status: 'Adequate' | 'Inadequate'
// }

// type Props = {
//     imageUri: string
//     thyrocytes?: Thyrocyte[]
//     clusters?: Cluster[]
//     originalWidth: number
//     originalHeight: number
// }

// export default function DetectionOverlay({
//     imageUri,
//     thyrocytes = [],
//     clusters = [],
//     originalWidth,
//     originalHeight,
// }: Props) {
//     const [layout, setLayout] = useState({ width: 0, height: 0 })

//     function onLayout(e: LayoutChangeEvent) {
//         setLayout(e.nativeEvent.layout)
//     }

//     if (!layout.width || !layout.height) {
//         return (
//             <View style={styles.container} onLayout={onLayout}>
//                 <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
//             </View>
//         )
//     }

//     // 🔑 handle resizeMode="contain"
//     const imageAspect = originalWidth / originalHeight
//     const containerAspect = layout.width / layout.height

//     let renderWidth = 0
//     let renderHeight = 0
//     let offsetX = 0
//     let offsetY = 0

//     if (imageAspect > containerAspect) {
//         renderWidth = layout.width
//         renderHeight = layout.width / imageAspect
//         offsetY = (layout.height - renderHeight) / 2
//     } else {
//         renderHeight = layout.height
//         renderWidth = layout.height * imageAspect
//         offsetX = (layout.width - renderWidth) / 2
//     }

//     const scaleX = renderWidth / originalWidth
//     const scaleY = renderHeight / originalHeight

//     return (
//         <View style={styles.container} onLayout={onLayout}>
//             <View style={StyleSheet.absoluteFill}>
//                 <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />

//                 {/* boxes render here */}
//             </View>

//             {/* CLUSTERS */}
//             {clusters.map((c, i) => {
//                 const [x1, y1, x2, y2] = c.bbox
//                 const color = c.status === 'Adequate' ? '#22c55e' : '#3b82f6'
//                 const label = c.status === 'Adequate' ? 'A' : 'I'

//                 return (
//                     <View
//                         key={`cluster-${i}`}
//                         style={[
//                             styles.clusterBox,
//                             {
//                                 left: x1 * scaleX + offsetX,
//                                 top: y1 * scaleY + offsetY,
//                                 width: (x2 - x1) * scaleX,
//                                 height: (y2 - y1) * scaleY,
//                                 borderColor: color,
//                             },
//                         ]}
//                     >
//                         <View style={[styles.clusterLabel, { backgroundColor: color }]}>
//                             <Text
//                                 style={styles.clusterLabelText}
//                             >
//                                 {c.num_thyrocytes}
//                             </Text>
//                         </View>
//                     </View>
//                 )
//             })}

//             {/* THYROCYTES */}
//             {thyrocytes.map((t, i) => {
//                 const [x1, y1, x2, y2] = t.bbox

//                 return (
//                     <View
//                         key={`cell-${i}`}
//                         style={[
//                             styles.cellBox,
//                             {
//                                 left: x1 * scaleX + offsetX,
//                                 top: y1 * scaleY + offsetY,
//                                 width: (x2 - x1) * scaleX,
//                                 height: (y2 - y1) * scaleY,
//                             },
//                         ]}
//                     />
//                 )
//             })}
//         </View>
//     )
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         width: '100%',
//         height: '100%',
//     },
//     image: {
//         width: '100%',
//         height: '100%',
//     },
//     overlay: {
//         ...StyleSheet.absoluteFillObject,
//     },

//     // CLUSTERS
//     clusterBox: {
//         position: 'absolute',
//         borderWidth: 1.5, // ⬅ thinner
//         borderRadius: 5,
//     },
//     clusterLabel: {
//         position: 'absolute',
//         top: -20,
//         left: 0,
//         paddingHorizontal: 5,
//         paddingVertical: 2,
//         borderRadius: 4,
//     },
//     clusterLabelText: {
//         color: 'white',
//         fontSize: 7,
//         fontWeight: '400',
//     },

//     // THYROCYTES
//     cellBox: {
//         position: 'absolute',
//         borderWidth: 1, // ⬅ thinner
//         borderColor: 'red',
//         borderRadius: 3,
//     },
// })


import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    LayoutChangeEvent,
} from 'react-native'
import { Image } from 'expo-image'

type BBox = [number, number, number, number]

type Thyrocyte = {
    bbox: BBox
    confidence: number
}

type Cluster = {
    bbox: BBox
    num_thyrocytes: number
    status: 'Adequate' | 'Inadequate'
}

type Props = {
    imageUri: string
    thyrocytes?: Thyrocyte[]
    clusters?: Cluster[]
    originalWidth: number
    originalHeight: number
}

export default function DetectionOverlay({
    imageUri,
    thyrocytes = [],
    clusters = [],
    originalWidth,
    originalHeight,
}: Props) {
    const [layout, setLayout] = useState({ width: 0, height: 0 })

    function onLayout(e: LayoutChangeEvent) {
        setLayout(e.nativeEvent.layout)
    }

    if (!layout.width || !layout.height) {
        return (
            <View style={styles.container} onLayout={onLayout}>
                <Image
                    source={{ uri: imageUri }}
                    style={styles.image}
                    contentFit="contain"
                    allowDownscaling={false}
                />
            </View>
        )
    }

    const imageAspect = originalWidth / originalHeight
    const containerAspect = layout.width / layout.height

    let renderWidth = 0
    let renderHeight = 0
    let offsetX = 0
    let offsetY = 0

    if (imageAspect > containerAspect) {
        renderWidth = layout.width
        renderHeight = layout.width / imageAspect
        offsetY = (layout.height - renderHeight) / 2
    } else {
        renderHeight = layout.height
        renderWidth = layout.height * imageAspect
        offsetX = (layout.width - renderWidth) / 2
    }

    const scaleX = renderWidth / originalWidth
    const scaleY = renderHeight / originalHeight

    return (
        <View style={styles.container} onLayout={onLayout}>
            <View style={StyleSheet.absoluteFill}>
                <Image
                    source={{ uri: imageUri }}
                    style={styles.image}
                    contentFit="contain"
                    allowDownscaling={false}
                    cachePolicy="memory-disk"
                />
            </View>

            {/* CLUSTERS */}
            {clusters.map((c, i) => {
                const [x1, y1, x2, y2] = c.bbox
                const color = c.status === 'Adequate' ? '#22c55e' : '#3b82f6'

                return (
                    <View
                        key={`cluster-${i}`}
                        style={[
                            styles.clusterBox,
                            {
                                left: x1 * scaleX + offsetX,
                                top: y1 * scaleY + offsetY,
                                width: (x2 - x1) * scaleX,
                                height: (y2 - y1) * scaleY,
                                borderColor: color,
                            },
                        ]}
                    >
                        <View style={[styles.clusterLabel, { backgroundColor: color }]}>
                            <Text style={styles.clusterLabelText}>
                                {c.num_thyrocytes}
                            </Text>
                        </View>
                    </View>
                )
            })}

            {/* THYROCYTES */}
            {thyrocytes.map((t, i) => {
                const [x1, y1, x2, y2] = t.bbox

                return (
                    <View
                        key={`cell-${i}`}
                        style={[
                            styles.cellBox,
                            {
                                left: x1 * scaleX + offsetX,
                                top: y1 * scaleY + offsetY,
                                width: (x2 - x1) * scaleX,
                                height: (y2 - y1) * scaleY,
                            },
                        ]}
                    />
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    clusterBox: {
        position: 'absolute',
        borderWidth: 1.5,
        borderRadius: 5,
    },
    clusterLabel: {
        position: 'absolute',
        top: -20,
        left: 0,
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 4,
    },
    clusterLabelText: {
        color: 'white',
        fontSize: 7,
        fontWeight: '400',
    },
    cellBox: {
        position: 'absolute',
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 3,
    },
})