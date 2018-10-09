package com.gdssoft.oa.service.archive;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import com.gdssoft.oa.model.archive.ArchivesType;
import com.gdssoft.core.service.BaseService;

public interface ArchivesTypeService extends BaseService<ArchivesType>{
	public ArchivesType findTypeByName(String name);
}


