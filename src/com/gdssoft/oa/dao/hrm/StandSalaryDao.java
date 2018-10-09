package com.gdssoft.oa.dao.hrm;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.model.hrm.StandSalary;
import com.gdssoft.core.dao.BaseDao;

/**
 * 
 * @author 
 *
 */
public interface StandSalaryDao extends BaseDao<StandSalary>{

	public boolean checkStandNo(String standardNo);
	/**
	 * 查找审核通过的工资标准列表
	 * @return  通过的工资标准列表
	 */
	public List<StandSalary> findByPassCheck();
	
}