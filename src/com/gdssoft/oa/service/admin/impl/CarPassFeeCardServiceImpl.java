package com.gdssoft.oa.service.admin.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.admin.CarPassFeeCardDao;
import com.gdssoft.oa.model.admin.CarPassFeeCard;
import com.gdssoft.oa.service.admin.CarPassFeeCardService;

public class CarPassFeeCardServiceImpl extends BaseServiceImpl<CarPassFeeCard> implements CarPassFeeCardService{
	@SuppressWarnings("unused")
	private CarPassFeeCardDao dao;
	
	public CarPassFeeCardServiceImpl(CarPassFeeCardDao dao) {
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