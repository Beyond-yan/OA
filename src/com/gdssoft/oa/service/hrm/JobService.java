package com.gdssoft.oa.service.hrm;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.model.hrm.Job;
import com.gdssoft.core.service.BaseService;

public interface JobService extends BaseService<Job>{
	/**
	 * @author lyy
	 * @param depId
	 * 根据部门的ID来查找部门下面的职位
	 * @return
	 */
	public List<Job> findByDep(Long depId);
}


