const { getType, isNode } = require('./utiles.js');

// 检查类型是否相等
function checkType(nodeType, traitNodeType)
{
    if (traitNodeType == '*') return true;
    if (typeof traitNodeType != "string") return false;
    
    const typeArray = traitNodeType.split('|');
    if (typeArray.length >= 2)
    {
        for (const type of typeArray)
        {
            if (type == nodeType) return true;
        }
        return false;
    }
    else if (typeArray.length == 1 && typeArray[0] == nodeType) return true;
    else return false;
}

// 判断是否符合特征
function hasTraitNode(node, traitNode) {
    if (!isNode(traitNode)) throw new Error("传入的特征节点不是node");

	if (!checkType(node['type'], traitNode['type'])) return false;   // 提升效率

	// 判断除去 node 节点的属性
	for (let key in traitNode) 
    {
        if ('type' == key) continue;
		if (node[key] == undefined) return false;                   // 提升效率

		if (!isNode(traitNode[key])) 
        {
			// 不包含子node的object
			if (getType(traitNode[key]) == 'object')
            {
				for (let secondaryKey in traitNode[key]) 
                {
					if (traitNode[key][secondaryKey] != node[key][secondaryKey]) return false;
				}
			} 
            else if (getType(traitNode[key]) == 'array') 
            {
				for (let i = 0; i < traitNode[key].length; ++i) 
                {
					// 可能会有 [, 1] 这样的
					if (traitNode[key][i] == null) 
                    {
						if (node[key][i] != null) return false;
					}

                    if (isNode(traitNode[key][i]))
                    {
                        // 递归判断子树
                        return hasTraitNode(node[key], traitNode[key]);
                    }
				}
			} 
            else 
            {
				if (traitNode[key] != node[key]) return false;
			}
		} 
        else 
        {
			// 递归判断子树
            return hasTraitNode(node[key], traitNode[key]);
		}
	}

	return true;
}

module.exports = {
	hasTraitNode,
};