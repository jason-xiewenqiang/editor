import uuid from '@/util/uuid';
import Config from '../BaseConfig';
/**
 * 合并生成 edge
 * @param {String} sourceId 源id
 * @param {String} targetId 目标id
 * @param {Object} cfg 配置参数
 */
const helper = (sourceId, targetId, cfg) => {
  const edge = {
    id: uuid(),
    source: sourceId,
    target: targetId,
    ...cfg,
  };
  const style = { ...Config.edge.style, ...edge.style };
  style.startArrow = false;
  style.endArrow = false;
  edge.style = style;
  return edge;
};

export default helper;
