package com.gdssoft.oa.service.archive.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 GDS ShenZhen Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.dao.archive.CommonUnitsDao;
import com.gdssoft.oa.model.archive.CommonUnits;
import com.gdssoft.oa.service.archive.CommonUnitsService;

public class CommonUnitsServiceImpl extends BaseServiceImpl<CommonUnits> implements CommonUnitsService{
	private CommonUnitsDao dao;
	
	public CommonUnitsServiceImpl(CommonUnitsDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public List<CommonUnits> getUnitsForSelector(
			String unitName,Short unitType, PagingBean pb) {
		// TODO Auto-generated method stub
		return dao.getUnitsForSelector( unitName, unitType,pb);
	}

}