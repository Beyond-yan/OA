package com.gdssoft.oa.dao.admin.impl;

/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import java.util.List;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.admin.CartRepairDao;
import com.gdssoft.oa.model.admin.CartRepair;

@SuppressWarnings("unchecked")
public class CartRepairDaoImpl extends BaseDaoImpl<CartRepair> implements
		CartRepairDao {

	public CartRepairDaoImpl() {
		super(CartRepair.class);
	}

	private String getCarRepair(CartRepair cartRepair) {
		Long carId = null;

		carId = cartRepair.getCarId();

		return " from CartRepair u where 1=1 "
				+ (carId != null ? " and u.car.id = " + carId : "");

	}

	public List<CartRepair> getCarRepairs(CartRepair cartRepair) {
		return find(getCarRepair(cartRepair), null, 1, 1);
	}
}