package com.gdssoft.oa.dao.admin.impl;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */
import java.util.List;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.admin.CarPassFeeCardDao;
import com.gdssoft.oa.model.admin.CarPassFeeCard;

@SuppressWarnings("unchecked")
public class CarPassFeeCardDaoImpl extends BaseDaoImpl<CarPassFeeCard>
		implements CarPassFeeCardDao {

	public CarPassFeeCardDaoImpl() {
		super(CarPassFeeCard.class);
	}

	@Override
	public void unBindWithCar(String cardID) {
		// TODO Auto-generated method stub
		String sql = "UPDATE car SET PAY_CARD_ID = NULL WHERE PAY_CARD_ID = "
				+ cardID;
		jdbcTemplate.execute(sql);
	}

	
}