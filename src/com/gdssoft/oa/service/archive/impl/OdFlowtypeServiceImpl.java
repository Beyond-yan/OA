package com.gdssoft.oa.service.archive.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 GDS ShenZhen Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.archive.OdFlowtypeDao;
import com.gdssoft.oa.model.archive.OdFlowtype;
import com.gdssoft.oa.service.archive.OdFlowtypeService;

public class OdFlowtypeServiceImpl extends BaseServiceImpl<OdFlowtype> implements OdFlowtypeService{
	private OdFlowtypeDao dao;
	
	public OdFlowtypeServiceImpl(OdFlowtypeDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public List<OdFlowtype> getFlowByType(Short flowType) {
		// TODO Auto-generated method stub
		return dao.getFlowByType(flowType);
	}

}