package com.gdssoft.oa.dao.flow;

import java.util.List;
import java.util.Map;

import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.oa.model.flow.FlowTaskReport;

/**
 * 
 * @author tony zhang
 * 获取收发文待办及在办件
 */
public interface FlowTaskReportDao extends BaseDao<FlowTaskReport> {
	public String getPreTaskInfo(Long taskId,Long runId);
	List<FlowTaskReport> getFlowTaskList(final Long userId,
			final int toDoType, final int archiveType, final String subject,
			final String depName, final Long defId, final String startDate,
			final String endDate,final int currentPage,final int pageSize);
	public List<FlowTaskReport> getDoingFlowTaskList(final Long userId,
			final int toDoType, final int archiveType, final String subject,
			final String depName, final Long defId, final String startDate,
			final String endDate,final int currentPage,final int pageSize,final String orgDepId,final String archiveNo,final Long signId,final String depSignNo,final String issuerName,final Long issuerDepid,final String assignUserName);
	/**
	 * 获取收发文待办及在办件
	 */
	public List<FlowTaskReport> getNewFlowTaskList(final Long userId,
			final int toDoType, final int archiveType, final String subject,
			final String depName, final Long defId, final String startDate,
			final String endDate,final int currentPage,final int pageSize,final String orgDepId,final String archiveNo,final Long signId,final String depSignNo,final String issuerName,final Long issuerDepid,final String assignUserName);

	/**
	 * 查询单个流程实例的待办和已办详情
	 * 
	 * @param runId
	 * @param userId
	 * @param archiveType
	 * @param currentPage
	 * @param pageSize
	 * @return
	 */
	public List<FlowTaskReport> getNewFlowTaskListDetail(Long runId, Long userId, int archiveType, 
			int currentPage, int pageSize);
	
	public List<Map<String, Object>> getOfficeMeetingTimes(String subject, String timesId,
			int currentPage, int pageSize);

	public List<Map<String, Object>> OfficeMeetingWleaderlist(String subject, String timesId,
			int currentPage, int pageSize);
	
	public List<Map<String, Object>> OfficeMeetingBGSZRlist(String subject, String timesId,
			int currentPage, int pageSize);
}
