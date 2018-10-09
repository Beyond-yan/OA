package com.gdssoft.oa.service.archive;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.model.archive.ArchRecUser;
import com.gdssoft.core.service.BaseService;

public interface ArchRecUserService extends BaseService<ArchRecUser>{
	public List findDepAll() ;

	public ArchRecUser getByDepId(Long depId);
}


