package com.gdssoft.oa.service.system;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.Date;
import java.util.List;

import javax.xml.crypto.Data;

import com.gdssoft.core.service.BaseService;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.model.system.SysDataTransfer;

public interface SysDataTransferService extends BaseService<SysDataTransfer>{
	
	public SysDataTransfer getDep(Long id);
	public List<SysDataTransfer> getListByArchivesId(Long archivesId);
	public void updateDownload(Long id);
	
	public int getListMonitorCount(Long archivesId, String depName, String receiveDate, Long receiveFlag, String receiveUserName);
	
	public List<SysDataTransfer> getListMonitor(int start, int limit, Long archivesId, String depName, String receiveDate, Long receiveFlag, String receiveUserName);


	Long count(String subject, String archivesno, Date endtime, Date creattime,
			String UserName,String archtype);

	List<SysDataTransfer> getReceiveDownload(int start, int limit,
			String subject, String archivesno, Date endtime, Date creattime,
			String UserName,String archtype);

	List<SysDataTransfer> getReceiveDownloadJW(int start, int limit,
			String subject, String archivesno, Date endtime, Date creattime,
			String UserName);

	int count(int start, int limit, String subject, String archivesno,
			Date endtime, Date creattime, String UserName);


	List<SysDataTransfer> getdepcode(Long depId,String fromShcemaid, String toShcemaid,
			String receiveDep, String receivetype, String subject,
			String sendDep, String receiveFlag, String issuer, int size,
			int start, String sourceType);

	Long count(Long depId,String fromShcemaid, String toShcemaid, String receiveDep,
			String receivetype, String subject, String sendDep,
			String receiveFlag, String issuer, String sourceType);
	
}


