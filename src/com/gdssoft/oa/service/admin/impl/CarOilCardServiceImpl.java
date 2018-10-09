package com.gdssoft.oa.service.admin.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.admin.CarOilCardDao;
import com.gdssoft.oa.model.admin.CarOilCard;
import com.gdssoft.oa.service.admin.CarOilCardService;

public class CarOilCardServiceImpl extends BaseServiceImpl<CarOilCard> implements CarOilCardService{
	@SuppressWarnings("unused")
	private CarOilCardDao dao;
	
	public CarOilCardServiceImpl(CarOilCardDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public void unBindWithCar(String cardID)
	{
		// TODO Auto-generated method stub
		dao.unBindWithCar(cardID);
	}
	

}