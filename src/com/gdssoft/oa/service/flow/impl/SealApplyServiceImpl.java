package com.gdssoft.oa.service.flow.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.flow.SealApplyDao;
import com.gdssoft.oa.model.flow.SealApply;
import com.gdssoft.oa.service.flow.SealApplyService;

public class SealApplyServiceImpl extends BaseServiceImpl<SealApply> implements SealApplyService{
	@SuppressWarnings("unused")
	private SealApplyDao dao;
	
	public SealApplyServiceImpl(SealApplyDao dao) {
		super(dao);
		this.dao=dao;
	}
	/**
	 * @category 查询列表
	 * @param sealApply
	 * @return f7400313
	 */
	public List<SealApply> searchSealList(SealApply sealApply){
		return dao.searchSealList(sealApply);
	}
}