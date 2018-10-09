package com.gdssoft.oa.service.hrm;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.model.hrm.StandSalary;
import com.gdssoft.core.service.BaseService;

public interface StandSalaryService extends BaseService<StandSalary>{

	public boolean checkStandNo(String standardNo);
	/**
	 * 查找审核通过的工资标准列表
	 * @return  通过的工资标准列表
	 */
	public List<StandSalary> findByPassCheck();
	
}


