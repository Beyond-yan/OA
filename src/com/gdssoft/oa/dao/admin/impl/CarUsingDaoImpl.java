package com.gdssoft.oa.dao.admin.impl;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */
import java.util.List;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.admin.CarUsingDao;
import com.gdssoft.oa.model.admin.CarUsing;

@SuppressWarnings("unchecked")
public class CarUsingDaoImpl extends BaseDaoImpl<CarUsing> implements
		CarUsingDao {

	public CarUsingDaoImpl() {
		super(CarUsing.class);
	}

	public CarUsing checkCarStatus(Long carId, Long carApplyId) {
		String sql = "from CarUsing c where c.car.carid=? and c.carApply.applyId=? and c.comingDt is not null";
		Object[] objs = { carId, carApplyId };
		List<CarUsing> carUsings = findByHql(sql, objs);
		if (carUsings == null || carUsings.size() == 0) {
			return null;
		}
		return carUsings.get(0);
	}

	public int getCarUsingCount(Long carApplyId) {
		String sql = "select count(1) from CAR_USING c where  c.APPLY_ID="
				+ carApplyId + " and c.COMING_DT is not null";
		int amount = this.jdbcTemplate.queryForInt(sql);
		return amount;
	}
}