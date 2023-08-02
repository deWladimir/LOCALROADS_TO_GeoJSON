select 
	TrackCode,
	[Name],
	DistanceFrom,
	DistanceTo,
	CoordinateHash
from General.dbo.Localroad_Roads
order by TrackCode;