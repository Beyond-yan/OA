package com.gdssoft.oa.dao.admin;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import java.util.List;

import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.oa.model.admin.CartRepair;

/**
 * 
 * @author
 * 
 */
public interface CartRepairDao extends BaseDao<CartRepair> {

	/**
	 * 
	 * 获取有外键关联的维修车辆
	 * 
	 * @param cartRepair
	 * @return
	 */
	public List<CartRepair> getCarRepairs(CartRepair cartRepair);
}