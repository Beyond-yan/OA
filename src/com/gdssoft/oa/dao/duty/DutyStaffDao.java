package com.gdssoft.oa.dao.duty;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.Date;
import java.util.List;

import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.oa.model.duty.DutyStaff;

/**
 * 
 * @author 
 *
 */
public interface DutyStaffDao extends BaseDao<DutyStaff>{
	/**
	 * 获取值班列表
	 * @param 班次
	 * @param 开始页数
	 * @param 开始日期
	 * @param 结束日期
	 * @return
	 */
	public List<DutyStaff> getDutyList(Long sectionId, int startSize,Date startDate,Date endDate);
	/**
	 * 获取列表个数
	 * @param 班次
	 * @return
	 */
	public Long getCount(Long sectionId,Date startDate,Date endDate);
	
}