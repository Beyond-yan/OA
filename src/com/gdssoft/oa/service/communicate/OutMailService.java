package com.gdssoft.oa.service.communicate;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;
import java.util.Map;

import com.gdssoft.oa.model.communicate.MailBox;
import com.gdssoft.oa.model.communicate.OutMail;
import com.gdssoft.core.service.BaseService;

public interface OutMailService extends BaseService<OutMail>{
	public List<OutMail> findByFolderId(Long folderId);
	public Long CountByFolderId(Long folderId);
	public Map getUidByUserId(Long userId);
	
}


