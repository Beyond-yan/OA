package com.gdssoft.oa.service.archive;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.archive.OdArchivescc;
import com.gdssoft.oa.model.flow.FlowTaskReport;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.SysDataTransfer;
import com.gdssoft.oa.model.work.WorkContent;
import com.gdssoft.core.service.BaseService;
import com.gdssoft.core.web.paging.PagingBean;

public interface ArchivesService extends BaseService<Archives>{
	public static final String HOST = "http://10.224.5.183:8080/cq_search";
	public static final String SCORE = "JW_ARCHIVES";
	public static final String QT = "select";
	public static final String SHEADER = HOST + "/" + SCORE + "/" + QT;
	public static String EMPTY_RESULT = "[]";
	/**
	 * 根据用户的ID或角色ID来查找当前用户的分发公文
	 */
	public List<Archives> findByUserOrRole(Long userId,Set<AppRole> roles,PagingBean pb);
	/**
	 * 启动子流程
	 * @param defId 流程定义ID
	 * @param archives 公文model
	 * @param processName 流程名称
	 * @param activityName 开始结点名称
	 * @param flowAssignIds 执行人
	 * @param createUser 子流程发起人
	 * @return
	 */
	public String startArchiveSubFlow(Long defId,Archives archives,String processName,String activityName,String flowAssignIds,AppUser createUser);
	
	public List<Archives> getCC(HttpServletRequest request,Long userId,String defId,String archivesNo,String depName,String subject);
	
	/**
	 * 通过流程实例Id获得公文对象实体
	 * @return
	 */
	public Archives getArchivesByRunId(Long runId);

	/**
	 * 通过流父流程Id得到子流程
	 * @return
	 */
	public List<Archives> getArchivesByParentId(Long parentId);
	/**
	 * 启动子流程实例
	 * @param createUser 流程的启动者
	 * @param archiveId 子流程公文ID
	 * @param defId 流程定义ID
	 * @param archives 子流程公文内容
	 * @param processName 流程名称
	 * @param startNodeName 开始节点名称
	 * @param flowAssignIdList 下一步执行人列表
	 * @return
	 */
	public boolean startSubProcess(AppUser createUser,Long archiveId,Long defId,Archives archives,String processName,String startNodeName,ArrayList<Map<String,String>> flowAssignIdList);
	/**
	 * 通过runId取得业务id
	 * @return 
	 * @author F3229233
	 */
	public Long getArchId(Long runId);
	/**
	 * 根据archiveType和status查找公文
	 * @param archiveType
	 * @param status
	 * @return
	 */
	public List<Archives> findArchives(short archiveType,short status,String startDate,String endDate);
	/**
	 * 根据archiveType和status查找公文
	 * @param archiveType
	 * @param status
	 * @return
	 */
	public List<Archives> findoverdueArchives(String schemaCode,short archiveType,short status,String startDate,String endDate);
	public List<Archives> findAllSchemaArchives(String schemaCode,short archiveType,short status,String startDate,String endDate);
	public List<FlowTaskReport> getFinishedFlow(final int archiveType,
			final String subject, final Long userId, final Long defId,
			final String issuedep, final String orgdepId,
			final String startDate, final String endDate,
			final String archiveNo, final String privacyLevel,
			final String urgentLevel,final Long snConfigId,final String depSignNo,final String issuerName,final int startPage, final int pageSize,
			final String dir,final String sort);
	
	public List<FlowTaskReport> getIsStandardFinishedFlow(final int archiveType,
			final String subject, final Long defId,
			final String issuedep, final String orgdepId,
			final String startDate, final String endDate,
			final String archiveNo, final String privacyLevel,
			final String urgentLevel,final Long snConfigId, final int startPage, final int pageSize);
	
	public InputStream receivelistToExcel(List<FlowTaskReport> list);
	public InputStream transferlistToExcel(List<SysDataTransfer> list);
	public InputStream sentlistToExcel(List<FlowTaskReport> list);
	
	public InputStream isStandardSentlistToExcel(List<FlowTaskReport> list);
	public InputStream workContentListToExcel(List<WorkContent> list);
	public Archives getArchivesByRunIdAndSchema(String schema, Long runId);
    public 	List<OdArchivescc> listCC(Long userId, String archivesNo, String depSignNo,
			String subject, int status, int start, int size);
	 public Long count(Long userId, String archivesNo, String depSignNo,
			String subject, int status);
	 public Long getrun(Long archivesId, String schemacode);
	List<OdArchivescc> listCCJW(Long userId, String archivesNo,
			String depSignNo, String subject, int status, int start, int size);
	int count(Long userId, String archivesNo, String depSignNo, String subject,
			int status, int start, int size);
	
	/**
	 * 交委行政、党委规范性文件查询
	 * 
	 * @param archiveType
	 * @param subject
	 * @param defId
	 * @param issuedep
	 * @param orgdepId
	 * @param startDate
	 * @param endDate
	 * @param archiveNo
	 * @param privacyLevel
	 * @param urgentLevel
	 * @param snConfigId
	 * @param isStandard
	 * @param examineRecordNumber
	 * @param startPage
	 * @param pageSize
	 * @return
	 */
	public List<FlowTaskReport> getIsStandardFinishedFlowJW(final int archiveType,
			final String subject, final Long defId,
			final String issuedep, final String orgdepId,
			final String startDate, final String endDate,
			final String archiveNo, final String privacyLevel,
			final String urgentLevel,final Long snConfigId, final Long isStandard, 
			final String keywords, final int startPage, final int pageSize);
	
	/**
	 * 交委行政、党委规范新个文件到期短信提醒
	 */
	public void sendSmsForStandardExpireJW();
}


