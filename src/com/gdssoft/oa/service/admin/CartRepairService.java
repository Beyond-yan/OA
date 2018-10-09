package com.gdssoft.oa.service.admin;

/*
 *   捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
 */
import java.util.List;

import com.gdssoft.core.service.BaseService;
import com.gdssoft.oa.model.admin.CartRepair;

public interface CartRepairService extends BaseService<CartRepair> {

	/**
	 * 
	 * 更新车辆的状态
	 * 
	 * @param carId
	 * @param RepairType
	 */
	public void updateCarStatus(Long carId, Integer RepairType);

	/**
	 * 
	 * 获取有外键关联的维修车辆
	 * 
	 * @param cartRepair
	 * @return
	 */
	public List<CartRepair> getCarRepairs(CartRepair cartRepair);

	/**
	 * 
	 * 更新车辆状态
	 * 
	 * @param carId
	 */
	public void updateCarStatus(Long carId);
	
}
