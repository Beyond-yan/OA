package com.gdssoft.oa.service.document.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import com.gdssoft.oa.dao.document.SealDao;
import com.gdssoft.oa.model.document.Seal;
import com.gdssoft.oa.service.document.SealService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class SealServiceImpl extends BaseServiceImpl<Seal> implements SealService{
	@SuppressWarnings("unused")
	private SealDao dao;
	
	public SealServiceImpl(SealDao dao) {
		super(dao);
		this.dao=dao;
	}

}