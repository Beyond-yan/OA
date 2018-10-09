package com.gdssoft.oa.service.personal.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.personal.AddrbookOuterDao;
import com.gdssoft.oa.model.personal.AddrbookOuter;
import com.gdssoft.oa.service.personal.AddrbookOuterService;

public class AddrbookOuterServiceImpl extends BaseServiceImpl<AddrbookOuter> implements AddrbookOuterService{
	@SuppressWarnings("unused")
	private AddrbookOuterDao dao;
	
	public AddrbookOuterServiceImpl(AddrbookOuterDao dao) {
		super(dao);
		this.dao=dao;
	}
	@Override
	public  List<AddrbookOuter> getouter(String personname){
		return dao.getouter(personname);
		
	}
}