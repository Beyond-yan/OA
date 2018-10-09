package com.gdssoft.oa.dao.work;

import java.util.List;

import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.oa.model.work.WorkContentProcess;

public interface WorkContentProcessDao extends BaseDao<WorkContentProcess>{
	public List<WorkContentProcess> getProcessListById(Long workContentId);
}
