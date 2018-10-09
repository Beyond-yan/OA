package com.gdssoft.oa.service.admin;

/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
 */
import com.gdssoft.core.service.BaseService;
import com.gdssoft.oa.model.admin.CarUsing;

public interface CarUsingService extends BaseService<CarUsing> {
	/**
	 * 
	 * 根据车辆,申请单 来查询这两车是否已经被收回
	 * 
	 * @param carId
	 * @param carApplyId
	 * @return
	 */
	public CarUsing checkCarStatus(Long carId, Long carApplyId);

	/**
	 * 
	 * 获取这个单的所有收车数量
	 * 
	 * @param carApplyId
	 * @return
	 */
	public int getCarUsingCount(Long carApplyId);

}
