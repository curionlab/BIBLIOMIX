// 知の化学反応マップ（バブルチャート）描画部品
import { gameState } from '../game/state.js';

const chartInstances = {};

/**
 * 知の化学反応マップ（バブルチャート）を描画
 * @param {HTMLCanvasElement} canvas
 * @param {Object} synthesisData - { datasets: [...], relationships: [...] }
 * @param {Function} onConceptClick - バブルクリック時のコールバック（概念名を渡す）
 */
export function renderSynthesisChart(canvas, synthesisData, onConceptClick) {
    // --- Phase3バブルチャート描画は現状不要のため全コードコメントアウト ---
    /*
    if (!canvas) return;
    const chartId = canvas.id || 'default-synthesis-chart';
    // データが不正ならcanvasをクリアしてreturn
    if (!synthesisData || !synthesisData.datasets || !Array.isArray(synthesisData.datasets) || synthesisData.datasets.length === 0) {
        const ctx = canvas.getContext('2d');
        ctx && ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (chartInstances[chartId]) {
            chartInstances[chartId].destroy();
            chartInstances[chartId] = null;
        }
        return;
    }
    if (chartInstances[chartId]) {
        chartInstances[chartId].destroy();
        chartInstances[chartId] = null;
    }
    const ctx = canvas.getContext('2d');
    chartInstances[chartId] = new window.Chart(ctx, {
        type: 'bubble',
        data: synthesisData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    enabled: true,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 12 },
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const dataPoint = context.raw;
                            return `${dataPoint.concept}: ${dataPoint.quote || ''}`;
                        }
                    }
                }
            },
            scales: {
                x: { display: false, min: 0, max: 10 },
                y: { display: false, min: 0, max: 10 }
            },
            onClick: (event, elements) => {
                if (elements.length > 0 && typeof onConceptClick === 'function') {
                    const firstElement = elements[0];
                    const datasetIndex = firstElement.datasetIndex;
                    const index = firstElement.index;
                    const conceptData = chartInstances[chartId].data.datasets[datasetIndex].data[index];
                    onConceptClick(conceptData.concept);
                }
            }
        },
        plugins: [{
            id: 'customCanvasDraw',
            afterDraw: (chart) => {
                const ctx = chart.ctx;
                const meta = chart.getDatasetMeta(0);
                const data = chart.data.datasets[0].data;
                const relationships = synthesisData.relationships || [];
                ctx.save();
                ctx.strokeStyle = '#D4A056';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                relationships.forEach(rel => {
                    const fromDataPoint = data.find(d => d.concept === rel.from);
                    const toDataPoint = data.find(d => d.concept === rel.to);
                    if (fromDataPoint && toDataPoint) {
                        const fromIndex = data.indexOf(fromDataPoint);
                        const toIndex = data.indexOf(toDataPoint);
                        const fromElement = meta.data[fromIndex];
                        const toElement = meta.data[toIndex];
                        if (fromElement && toElement) {
                            ctx.beginPath();
                            ctx.moveTo(fromElement.x, fromElement.y);
                            ctx.lineTo(toElement.x, toElement.y);
                            ctx.stroke();
                        }
                    }
                });
                ctx.restore();
            }
        }]
    });
    */
}
