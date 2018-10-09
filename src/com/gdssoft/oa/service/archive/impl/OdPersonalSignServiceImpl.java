package com.gdssoft.oa.service.archive.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 GDS ShenZhen Software Limited Company.
*/
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.archive.OdPersonalSignDao;
import com.gdssoft.oa.model.archive.OdPersonalSign;
import com.gdssoft.oa.service.archive.OdPersonalSignService;

public class OdPersonalSignServiceImpl extends BaseServiceImpl<OdPersonalSign> implements OdPersonalSignService{
	@SuppressWarnings("unused")
	private OdPersonalSignDao dao;
	
	public OdPersonalSignServiceImpl(OdPersonalSignDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public int judgeOdPersonalSignNum(Long userId) {
		// TODO Auto-generated method stub
		return dao.judgeOdPersonalSignNum(userId);
	}

	@Override
	public String getOdPersonSign(Long userId) {
		// TODO Auto-generated method stub
		return dao.getOdPersonSign(userId);
	}

}