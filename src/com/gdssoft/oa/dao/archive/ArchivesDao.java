package com.gdssoft.oa.dao.archive;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import com.gdssoft.oa.model.admin.CarApply;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.archive.ArchivesMonitor;
import com.gdssoft.oa.model.archive.OdArchivescc;
import com.gdssoft.oa.model.flow.FlowTaskReport;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.core.web.paging.PagingBean;

/**
 * 
 * @author 
 *
 */
public interface ArchivesDao extends BaseDao<Archives>{
	/**
	 * 根据用户的ID或角色来查找当前用户的分发公文
	 */
	public List<Archives> findByUserOrRole(Long userId,Set<AppRole> roles,PagingBean pb);
	
	public List<Archives> getCC(HttpServletRequest request,Long userId,String defId,String archivesNo,String depName,String subject);
	

	/**
	 * 通过流程实例Id获得公文对象实体
	 * @return
	 */
	public Archives getArchivesByRunId(Long runId);

	
	public List<Archives> getArchivesByParentId(Long parentId);

	public Long getArchId(Long runId);
	
	/**
	 * 根据archiveType和status查找公文
	 * @param archiveType
	 * @param status
	 * @return
	 */
	public List<Archives> findArchives(short archiveType,short status,String startDate,String endDate);
	
	public List<Archives> findArchives(String schema, Short isStandard, Short runStatus,
			String keywords, Long isComSetting, String electronicDocStartDate,
			String electronicDocEndDate);
	
	/**
	 * 根据archiveType和status查找公文
	 * @param archiveType
	 * @param status
	 * @return
	 */
	public List<Archives> findAllSchemaArchives(String schemaCode,short archiveType,short status,String startDate,String endDate);
	public List<Archives> findOverdueArchives(String schemaCode,short archiveType,short status,String startDate,String endDate);
	public List<FlowTaskReport> getFinishedFlow(final int archiveType,
			final String subject, final Long userId, final Long defId,
			final String issuedep, final String orgdepId,
			final String startDate, final String endDate,
			final String archiveNo, final String privacyLevel,
			final String urgentLevel,final Long snConfigId,final String depSignNo,final String issuerName, final int startPage, final int pageSize,
			final String dir, final String sort);

	
	/**
	 * 规范性文件
	 */
	public List<FlowTaskReport> getIsStandardFinishedFlow(final int archiveType,
			final String subject, final Long defId,
			final String issuedep, final String orgdepId,
			final String startDate, final String endDate,
			final String archiveNo, final String privacyLevel,
			final String urgentLevel, final Long snConfigId, final int startPage, final int pageSize);
	/**
	 * 提供公开文档
	 * @return
	 */
	public List<Archives> findPublicArchives(String count);
	
	/**
	 * 根据用户传入schema查找
	 * 通过流程实例Id获得公文对象实体
	 * @return
	 */
	public Archives getArchivesByRunIdAndSchema(String schema, Long runId);
	List<OdArchivescc> listCC(Long userId, String archivesNo, String depSignNo,
			String subject, int status, int start, int size);

	Long count(Long userId, String archivesNo, String depSignNo,
			String subject, int status);
	/**
	 * 查询公开公文的详细信息
	 * @param archivesId
	 * @return
	 */
	public Archives getPublicArchiveDetail(String archivesId,String Schema);

	Long getrun(Long archivesId, String schemacode);
	
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
			final String urgentLevel, final Long snConfigId, final Long isStandard, final String keywords, final int startPage, final int pageSize);

}
