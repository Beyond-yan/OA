package com.gdssoft.oa.dao.admin.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.admin.CarOilCardDao;
import com.gdssoft.oa.model.admin.CarOilCard;

@SuppressWarnings("unchecked")
public class CarOilCardDaoImpl extends BaseDaoImpl<CarOilCard> implements CarOilCardDao{

	public CarOilCardDaoImpl() {
		super(CarOilCard.class);
	}

	@Override
	public void unBindWithCar(String cardID)
	{
		// TODO Auto-generated method stub
		String sql = "UPDATE car SET OIL_CARD_ID = NULL WHERE OIL_CARD_ID = "+cardID; 
		jdbcTemplate.execute(sql);
	}

}