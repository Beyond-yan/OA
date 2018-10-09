package com.gdssoft.oa.dao.flow;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.oa.model.flow.SealApply;

/**
 * 
 * @author 
 *
 */
public interface SealApplyDao extends BaseDao<SealApply>{
	/**
	 * @category 查询列表
	 * @param sealApply
	 * @return f7400313
	 */
	public List<SealApply> searchSealList(SealApply sealApply);
}