package com.gdssoft.oa.dao.system;


import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.oa.model.system.SnGenerator;

public interface SnGeneratorDao extends BaseDao<SnGenerator> {
	
	public SnGenerator getLastSNByPrefix(String prefix);
	
}
