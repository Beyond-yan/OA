package com.gdssoft.oa.dao.archive.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 GDS ShenZhen Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.archive.OdFlowtypeDao;
import com.gdssoft.oa.model.archive.OdFlowtype;

@SuppressWarnings("unchecked")
public class OdFlowtypeDaoImpl extends BaseDaoImpl<OdFlowtype> implements OdFlowtypeDao{

	public OdFlowtypeDaoImpl() {
		super(OdFlowtype.class);
	}

	@Override
	public List<OdFlowtype> getFlowByType(Short flowType) {
		// TODO Auto-generated method stub
		String hql = "select ft from OdFlowtype ft where ft.flowType="+flowType;
		return findByHql(hql);
	}

}