package com.gdssoft.oa.service.archive;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.Date;

import com.gdssoft.oa.model.archive.ArchHasten;
import com.gdssoft.core.service.BaseService;

public interface ArchHastenService extends BaseService<ArchHasten>{
	/**
	 * 获取最后一次发送催办信息的时间
	 * @param archivesId
	 * @param userId
	 * @return
	 */
	public Date getLeastRecordByUser(Long archivesId);
}


