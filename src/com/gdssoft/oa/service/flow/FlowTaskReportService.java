package com.gdssoft.oa.service.flow;

import java.util.List;
import java.util.Map;
import java.io.IOException;

import com.gdssoft.core.service.BaseService;
import com.gdssoft.oa.model.archive.Archives;
import com.gdssoft.oa.model.flow.FlowTaskReport;
import com.gdssoft.oa.model.flow.SolrArchives;

public interface FlowTaskReportService extends BaseService<FlowTaskReport>{
	public List<FlowTaskReport> getFlowTaskList(final Long userId,
			final int toDoType, final int archiveType, final String subject,
			final String depName, final Long defId, final String startDate,
			final String endDate,final int currentPage,final int pageSize);
	
	/**
	 * 获取收发文待办及在办件
	 */
	public List<FlowTaskReport> getNewFlowTaskList(final Long userId,
			final int toDoType, final int archiveType, final String subject,
			final String depName, final Long defId, final String startDate,
			final String endDate,final int currentPage,final int pageSize,final String orgDepId,final String archiveNo,final Long signId,final String depSignNo,final String issuerName,final Long issuerDepid,final String assignUserName);
	public List<FlowTaskReport> getnewJwArchives(final Long userId,
			final int toDoType, final int archiveType, final String subject,
			final String depName, final Long defId, final String startDate,
			final String endDate, final int currentPage, final int pageSize,
			final String orgDepId, final String archiveNo, final Long signId,
			final String depSignNo, final String issuerName,
			final Long issuerDepid) ;
	public int count(final Long userId,
			final int toDoType, final int archiveType, final String subject,
			final String depName, final Long defId, final String startDate,
			final String endDate, final int currentPage, final int pageSize,
			final String orgDepId, final String archiveNo, final Long signId,
			final String depSignNo, final String issuerName,
			final Long issuerDepid);
	
	public List<Map<String, Object>> getOfficeMeetingTimes(final String subject,final String timesId, final int currentPage,final int pageSize);

	public List<Map<String, Object>> OfficeMeetingWleaderlist(final String subject,final String timesId, final int currentPage,final int pageSize);

	public List<Map<String, Object>> OfficeMeetingBGSZRlist(final String subject,final String timesId, final int currentPage,final int pageSize);
	/**
	 * OA办公小助手搜索查询
	 */
	public List<Archives> getSearchList(String subject,String archiveNo,String docName,String fileName,int currentPage,int pageSize,String archType);
	public String call(String url) throws IOException;
	/**
	 * OA办公小助手菜单搜索查询
	 * add by sicen.liu
	 */
	public List<Archives> getMenuSearchList(String searchText,int currentPage,int pageSize,String archType);
	
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
}
