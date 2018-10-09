package com.gdssoft.oa.service.mileages.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.Date;
import java.util.List;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.admin.CarDriverDao;
import com.gdssoft.oa.dao.mileages.MileagesDao;
import com.gdssoft.oa.model.mileages.Mileages;
import com.gdssoft.oa.service.mileages.MileagesService;

public class MileagesServiceImpl extends BaseServiceImpl<Mileages> implements MileagesService{
	@SuppressWarnings("unused")
	private MileagesDao dao;
	
	public MileagesServiceImpl(MileagesDao dao) {
		super(dao);
		this.dao=dao;
	}
	@Override
	public List<Mileages> selectByCostType(Date startDate, Date endDate,String cn,int size ,int start){
		return dao.selectByCostType(startDate, endDate, cn,size ,start);
	}
	@Override
	public Long count(Date startDate, Date endDate,String cn){
		return dao.count(startDate, endDate, cn);
	}
}